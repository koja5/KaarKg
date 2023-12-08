import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ShippingAddress } from '@stripe/stripe-js';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { UserType } from 'src/app/enums/user-type';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';
import { Stripe, StripeCard } from 'stripe-angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild('stripeCard') stripeCard!: StripeCard;
  @Output() successEmitter = new EventEmitter<null>();
  public language: any;
  public products: any;
  public subtotalNetoForProduct = 0;
  public subtotalNeto = 0;
  public subtotalBruto = 0;
  public shipping: any;
  public shippingNotAvailable = false;
  public total: string | undefined;
  public vat: string | undefined;
  public shippingAddress: any;
  public mainAddress: any;
  public type: any;
  public loader = false;
  public countries: any;
  public shippingPrices: any;
  public paymentOption: any;
  public additionalPay: any = {};
  public paymentOptionView!: string;

  constructor(
    public helpService: HelpService,
    private storageService: StorageService,
    private service: CallApiService,
    private toastr: ToastrComponent
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.type = this.helpService.getAccountTypeId();
    this.setNetoAndBrutoPrice();
    this.getCountries();
    this.shippingAddress =
      this.storageService.getLocalStorageObject('shipping');
    this.paymentOption =
      this.helpService.getSessionStorageStringValue('payment');
    this.paymentOptionView =
      this.paymentOption === this.language.paymentPrepaymentOptionsForMail
        ? this.language.paymentPrepaymentOptions
        : this.paymentOption === this.language.paymentPerInvoiceOptionsForMail
        ? this.language.paymentPerInvoiceOptions
        : this.language.paymentPayOptions;
    this.getMainAddress();
  }

  getMainAddress() {
    this.service
      .callGetMethod('api/getMyShippingAddress', '')
      .subscribe((data: any) => {
        this.mainAddress = data[0];
      });
  }

  setNetoAndBrutoPrice() {
    this.products = this.helpService.getLocalStorage('cart');
    if (this.type === this.helpService.getUserTypeModel().customer) {
      for (let i = 0; i < this.products.length; i++) {
        this.products[i].neto = Number(this.products[i].price).toFixed(2);
        this.products[i].bruto = Number(
          this.products[i].quantity * this.products[i].price
        ).toFixed(2);
        this.products[i].vat = '20%';
      }
    } else {
      for (let i = 0; i < this.products.length; i++) {
        this.products[i].neto = Number(this.products[i].price).toFixed(2);
        this.products[i].bruto = Number(
          this.products[i].price * this.products[i].quantity
        ).toFixed(2);
        this.products[i].vat = '20%';
        if (this.products[i].number_of_pieces > 1) {
          this.products[i].title =
            this.products[i].title +
            ` (${this.language.productPackageFirstPart} ${this.products[i].number_of_pieces} ${this.language.productPackageLastPart})`;
        }
      }
    }
  }

  pay(orderDate: any) {
    if (!orderDate) {
      orderDate = this.helpService.getCurrentDatetime();
    }
    let data = {
      shippingAddress: this.shippingAddress,
      mainAddress: this.mainAddress,
      language: this.helpService.getLanguage(),
      products: this.products,
      subtotalNeto: this.additionalPay['subtotalNeto'],
      total: this.additionalPay['total'],
      vat: this.additionalPay['vat'],
      shipping: this.additionalPay['shipping'],
      shippingNotAvailable: this.additionalPay['shippingNotAvailable'],
      paymentOption: this.paymentOption,
      orderDate: orderDate,
      type: this.type,
    };

    this.loader = true;

    setTimeout(() => {
      this.helpService.removeLocalStorage('cart');
      this.helpService.removeSessionStorage('payment');
      this.loader = false;
      this.helpService.removeSessionStorage('step');
      this.successEmitter.emit();
    }, 200);

    this.service
      .callPostMethod('/api/sendInvoiceToCustomer', data)
      .subscribe((data) => {
        if (!data) {
          this.toastr.showErrorCustom(
            this.language.paymentProblemWithOrder,
            ''
          );
        }
      });

    this.service
      .callPostMethod('/api/createOrder', {
        user_id: this.mainAddress.id,
        order_date: orderDate,
        payment_option: this.paymentOption,
        order_details: JSON.stringify(data),
      })
      .subscribe((data) => {
        console.log(data);
      });

    this.service
      .callPostMethod('/api/sendInvoiceToSuperadmin', data)
      .subscribe((data) => {
        if (!data) {
          this.toastr.showErrorCustom(
            this.language.paymentProblemWithOrder,
            ''
          );
        }
      });
  }

  getCountries() {
    if (!this.countries) {
      this.service.callGetMethod('/api/getCountries', '').subscribe((data) => {
        this.countries = data;
      });
    }
  }

  onStripeError(error: any) {
    if (error) {
      this.toastr.showErrorCustom(this.language.paymentCardIsNotValid, '');
    }
  }

  setStripeToken(token: stripe.Token) {
    if (token) {
      const orderDate = this.helpService.getCurrentDatetime();
      const data = {
        token: token,
        price: this.additionalPay['total'],
        description: this.getDescriptionInformation(orderDate),
      };

      this.loader = true;
      this.service.callPostMethod('/api/createAdPayment', data).subscribe(
        (data) => {
          if (data) {
            this.pay(orderDate);
          } else {
            this.toastr.showErrorCustom(
              this.language.paymentCardIsNotValid,
              ''
            );
            this.loader = false;
          }
        },
        (error) => {
          this.toastr.showErrorCustom(this.language.paymentCardIsNotValid, '');
          this.loader = false;
        }
      );
    }
  }

  getDescriptionInformation(orderDate: string) {
    return (
      orderDate +
      ': ' +
      this.shippingAddress.firstname +
      ' ' +
      this.shippingAddress.lastname +
      ', ' +
      this.shippingAddress.address +
      ', ' +
      this.shippingAddress.zip +
      ' ' +
      this.shippingAddress.city +
      (this.shippingAddress.telephone
        ? ', ' + this.shippingAddress.telephone
        : '') +
      (this.shippingAddress.email ? ', ' + this.shippingAddress.email : '')
    );
  }

  getPricePerItem(price: number, quantity: number) {
    return Number(price * quantity).toFixed(2);
  }

  emitProperty(event: any) {
    this.additionalPay[event.name] = event.value;
  }
}
