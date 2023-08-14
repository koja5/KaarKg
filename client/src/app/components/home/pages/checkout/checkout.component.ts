import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ShippingAddress } from '@stripe/stripe-js';
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

  constructor(
    private helpService: HelpService,
    private storageService: StorageService,
    private service: CallApiService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    // this.products = this.storageService.getCookieObject('cart');
    this.type = this.helpService.getAccountTypeId();
    this.getCountries();
    this.getShippingPrices();
    this.shippingAddress =
      this.storageService.getLocalStorageObject('shipping');
    this.paymentOption =
      this.helpService.getSessionStorageStringValue('payment');
    this.getMainAddress();
  }

  getMainAddress() {
    this.service
      .callGetMethod('api/getMyShippingAddress', '')
      .subscribe((data: any) => {
        this.mainAddress = data[0];
      });
  }

  calculateProducts() {
    this.getSubtotalWithShipping();
    this.getTotal();
  }

  setNetoAndBrutoPrice() {
    if (this.type === 3) {
      for (let i = 0; i < this.products.length; i++) {
        this.products[i].bruto = this.products[i].price;
        this.products[i].neto = Number(this.products[i].price / 1.2).toFixed(2);
        // products[i].bruto = products[i].price;
        this.products[i].vat = '20%';
      }
    } else {
      for (let i = 0; i < this.products.length; i++) {
        this.products[i].neto = this.products[i].price;
        this.products[i].bruto = Number(this.products[i].price * 1.2).toFixed(
          2
        );
        this.products[i].vat = '20%';
        if (this.products[i].number_of_pieces > 1) {
          this.products[i].title =
            this.products[i].title +
            ` (${this.language.productPackageFirstPart} ${this.products[i].number_of_pieces} ${this.language.productPackageLastPart})`;
        }
      }
    }
  }

  getSubtotal() {
    this.subtotalNeto = 0;
    this.subtotalBruto = 0;
    this.subtotalNetoForProduct = 0;
    for (let i = 0; i < this.products.length; i++) {
      this.subtotalNeto += Number(
        this.products[i].neto * this.products[i].quantity
      );
      this.subtotalBruto += Number(
        this.products[i].bruto * this.products[i].quantity
      );
      this.subtotalNetoForProduct += Number(
        this.products[i].neto * this.products[i].quantity
      );
    }
  }

  getSubtotalWithShipping() {
    this.subtotalNeto += this.shipping;
    this.subtotalBruto += this.shipping;
    this.vat = Number(this.subtotalNeto * 0.2).toFixed(2);
  }

  getTotal() {
    if (this.type === 3) {
      this.total = Number(this.subtotalBruto * 1.2).toFixed(2);
    } else {
      this.total = Number(this.subtotalNeto * 1.2).toFixed(2);
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
      subtotalNeto: this.subtotalNeto,
      total: this.total,
      vat: this.vat,
      shipping: this.shipping,
      shippingNotAvailable: this.shippingNotAvailable,
      paymentOption: this.paymentOption,
      orderDate: orderDate,
    };
    this.loader = true;
    this.service
      .callPostMethod('/api/sendInvoiceToCustomer', data)
      .subscribe((data) => {
        console.log(data);
      });

    this.service
      .callPostMethod('/api/sendInvoiceToSuperadmin', data)
      .subscribe((data) => {
        console.log(data);
        if (data) {
          this.storageService.removeCookie('cart');
          this.helpService.removeSessionStorage('payment');
          this.loader = true;
          this.helpService.removeSessionStorage('step');
          this.successEmitter.emit();
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

  getShippingPrices() {
    if (!this.shippingPrices) {
      this.service
        .callGetMethod('/api/getShippingPrices', '')
        .subscribe((data) => {
          this.shippingPrices = data;
          this.calculateShippingPrice();
        });
    } else {
      this.calculateShippingPrice();
    }
  }

  calculateShippingPrice() {
    this.products = this.storageService.getCookieObject('cart');
    this.setNetoAndBrutoPrice();
    this.getSubtotal();
    let ind = 1;
    for (let i = 0; i < this.shippingPrices.length; i++) {
      if (
        this.shippingAddress.country_id === this.shippingPrices[i].country_id
      ) {
        ind = 0;
        this.shipping =
          this.subtotalNetoForProduct <
          this.getShippingLimitForUserType(this.shippingPrices[i])
            ? this.getShippingPriceForUserType(this.shippingPrices[i])
            : 0;
        break;
      }
    }
    if (ind) {
      this.shipping = 0;
      this.shippingNotAvailable = true;
    }
    this.calculateProducts();
  }

  getShippingPriceForUserType(data: any) {
    const type = this.helpService.getAccountTypeId();
    switch (type) {
      case UserType.dealer:
        return data.dealer_price;
      case UserType.kindergarden:
        return data.kindergarden_price;
      default:
        return data.customer_price;
    }
  }

  getShippingLimitForUserType(data: any) {
    const type = this.helpService.getAccountTypeId();
    switch (type) {
      case UserType.dealer:
        return Number(data.dealer_limit);
      case UserType.kindergarden:
        return Number(data.kindergarden_limit);
      default:
        return Number(data.customer_limit);
    }
  }

  setStripeToken(token: stripe.Token) {
    if (token) {
      const orderDate = this.helpService.getCurrentDatetime();
      const data = {
        token: token,
        price: this.total,
        description: this.getDescriptionInformation(orderDate),
      };

      this.loader = true;
      this.service
        .callPostMethod('/api/createAdPayment', data)
        .subscribe((data) => {
          if (data) {
            this.pay(orderDate);
          }
        });
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
      ', ' +
      this.shippingAddress.telephone +
      ', ' +
      this.shippingAddress.email
    );
  }

  getPricePerItem(price: number, quantity: number) {
    return Number(price * quantity).toFixed(2);
  }
}
