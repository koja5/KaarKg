import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserType } from 'src/app/enums/user-type';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-payment-additional-amount',
  templateUrl: './payment-additional-amount.component.html',
  styleUrls: ['./payment-additional-amount.component.scss'],
})
export class PaymentAdditionalAmountComponent implements OnInit {
  @Input() shippingInfo = false;
  @Input() shippingAddress: any;
  @Output() emitProperty = new EventEmitter<any>();

  public language: any;
  public shippingPrices: any;
  public user: any;
  public products: any;
  public subtotalNeto = 0;
  public subtotalNetoWithoutShipping = 0;
  public subtotalBruto = 0;
  public subtotalNetoForProduct = 0;
  public shipping: any;
  public vat: any;
  public total: any;
  public shippingNotAvailable = false;
  public shippingLimit = 0;
  public shippingCountry!: string;

  public subscriptionForCartInformation!: Subscription;
  public subscriptionForAdditionaPaymentPrice!: Subscription;
  public text: any;

  constructor(
    public helpService: HelpService,
    private service: CallApiService,
    private storageService: StorageService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.text = this.helpService.getCustomText();
    this.getMyShippingAddress();

    this.subscriptionForCartInformation = this.messageService
      .getRefreshCartInformation()
      .subscribe((message) => {
        this.calculateAllPrices();
      });

    this.subscriptionForAdditionaPaymentPrice = this.messageService
      .getRefreshForAdditionaPaymentPrice()
      .subscribe((message) => {
        this.calculateAllPrices();
      });
  }

  ngOnDestroy(): void {
    this.subscriptionForCartInformation.unsubscribe();
    this.subscriptionForAdditionaPaymentPrice.unsubscribe();
  }

  checkShipping() {
    if (this.user) {
      let ind = 1;
      if (this.shippingAddress) {
        this.user = this.shippingAddress;
      }
      for (let i = 0; i < this.shippingPrices.length; i++) {
        if (this.user.country_id === this.shippingPrices[i].country_id) {
          ind = 0;
          this.shippingLimit = this.getShippingLimitForUserType(
            this.shippingPrices[i]
          );
          this.shipping =
            this.subtotalNetoWithoutShipping < this.shippingLimit
              ? this.getShippingPriceForUserType(this.shippingPrices[i])
              : 0;
          break;
        }
      }

      if (ind) {
        this.shipping = 0;
        this.shippingNotAvailable = true;
      }
    } else {
      const defaultCountry = this.getDefaultPreselectedShippingCountry();
      this.shippingLimit = defaultCountry.limit;
      this.shipping =
        this.subtotalNetoWithoutShipping < this.shippingLimit
          ? defaultCountry.shipping
          : 0;
      this.shippingCountry = defaultCountry.name;
    }

    this.emitProperty.emit({
      name: 'shippingNotAvailable',
      value: this.shippingNotAvailable,
    });
    this.emitProperty.emit({ name: 'shipping', value: this.shipping });
  }

  getMyShippingAddress() {
    this.service.callGetMethod('/api/getMyShippingAddress', '').subscribe(
      (data: any) => {
        this.getShippingPrices();
        this.user = data[0];
      },
      (error) => {
        this.getShippingPrices();
      }
    );
  }

  getShippingPrices() {
    if (!this.shippingPrices) {
      this.service
        .callGetMethod('/api/getShippingPrices', '')
        .subscribe((data) => {
          this.shippingPrices = data;
          this.calculateAllPrices();
        });
    } else {
      this.calculateAllPrices();
    }
  }

  getDefaultPreselectedShippingCountry() {
    for (let i = 0; i < this.shippingPrices.length; i++) {
      if (this.shippingPrices[i].preselected) {
        return {
          limit: this.shippingPrices[i].customer_limit,
          shipping: this.shippingPrices[i].customer_price,
          name: this.shippingPrices[i].name,
        };
      }
    }

    return {
      limit: false,
      shipping: false,
      name: null,
    };
  }

  calculateAllPrices() {
    this.products = this.helpService.getLocalStorage('cart');
    this.setNetoAndBrutoPrice();
    this.getSubtotal();
    this.checkShipping();
    this.calculateProducts();
  }

  setNetoAndBrutoPrice() {
    if (
      this.helpService.getAccountTypeId() === -1 ||
      this.helpService.getAccountTypeId() ===
        this.helpService.getUserTypeModel().customer
    ) {
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
        this.products[i].price * this.products[i].quantity
      );
      this.subtotalBruto += Number(
        this.products[i].bruto * this.products[i].quantity
      );
    }
    this.subtotalNetoWithoutShipping = this.helpService.copyObject(
      this.subtotalNeto
    );
  }

  calculateProducts() {
    this.getSubtotalWithShipping();
    this.getTotal();
  }

  getSubtotalWithShipping() {
    this.subtotalNetoForProduct = Number(this.subtotalBruto);
    this.subtotalNeto += this.shipping;
    this.subtotalBruto += this.shipping;
    this.vat = Number(this.subtotalNeto * 0.2).toFixed(2);
    this.emitProperty.emit({ name: 'vat', value: this.vat });
    this.emitProperty.emit({ name: 'subtotalNeto', value: this.subtotalNeto });
  }

  getTotal() {
    if (
      this.helpService.getAccountTypeId() == -1 ||
      this.helpService.getAccountTypeId() ===
        this.helpService.getUserTypeModel().customer
    ) {
      this.total = Number(this.subtotalNeto).toFixed(2);
    } else {
      this.total = Number(this.subtotalNeto + Number(this.vat)).toFixed(2);
    }

    this.emitProperty.emit({ name: 'total', value: this.total });
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
}
