import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { PaymentOption } from 'src/app/enums/payment-option';
import { UserType } from 'src/app/enums/user-type';
import { ShippingAddress } from 'src/app/models/shipping-address-model';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @ViewChild('shippingAddressDialog') shippingAddressDialog!: DialogComponent;
  public user: any;
  public shippingAddresses: any;
  public language: any;
  public currentStep = 0;
  public paymentOption: PaymentOption = PaymentOption.invoice;
  public paymentOptionSelect: string | undefined;
  public userType!: UserType;
  public loader = false;
  public shippingAddress = new ShippingAddress();
  public shippingActionType = '';
  public mainShippingAddressEditable = true;
  public type: number | undefined;
  public countries: any;
  public products: any;
  public subOfProductInCart = 0;

  constructor(
    private service: CallApiService,
    private helpService: HelpService,
    private storageService: StorageService,
    private router: Router,
    private toastr: ToastrComponent,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initialize();
  }

  ngAfterViewInit(): void {
    document.onclick = (args: any): void => {
      if (args.target.className === 'e-dlg-overlay') {
        this.shippingAddressDialog.hide();
      }
    };
  }

  initialize() {
    this.getShippingAddresses();
    this.products = this.storageService.getCookieObject('cart');
    this.checkSubtotal();
    this.type = this.helpService.getAccountTypeId();

    if (this.type === 3) {
      this.paymentOption = PaymentOption.prepayment;
      this.paymentOptionSelect = this.language.paymentPrepaymentOptionsForMail;
      this.helpService.setSessionStorage('payment', this.paymentOptionSelect);
    } else {
      this.paymentOption = PaymentOption.invoice;
      this.paymentOptionSelect = this.language.paymentPerInvoiceOptionsForMail;
      this.helpService.setSessionStorage('payment', this.paymentOptionSelect);
    }

    this.service.callGetMethod('/api/getMyShippingAddress', '').subscribe(
      (data: any) => {
        this.user = data[0];
        this.selectShippingAddress(this.user, true);
      },
      (error) => {
        this.router.navigate(['./']);
        this.toastr.showInfoCustom('', this.language.paymentNeedToLogin);
      }
    );
  }

  getShippingAddresses() {
    this.loader = true;
    this.service
      .callGetMethod('/api/getAllShippingAddressForUser', '')
      .subscribe((data) => {
        this.shippingAddresses = data;
        this.loader = false;
      });
  }

  generateLabel(value: any) {
    return (
      value.firstname +
      ' ' +
      value.lastname +
      ', ' +
      value.address +
      ', ' +
      (value.zip ? value.zip + ' ' : '') +
      (value.city ? value.city + ', ' : '') +
      value.country_name +
      ', ' +
      value.telephone +
      ', ' +
      value.email
    );
  }

  editDialogShippingAddress(address: any, mainShippingAddress: boolean) {
    this.shippingAddress = address;
    this.mainShippingAddressEditable = mainShippingAddress;
    this.shippingActionType = 'edit';
    this.getCountries();
    this.shippingAddressDialog.show();
  }

  deleteDialogShippingAddress(address: any) {
    // this.confirmDialogComponent.showDialog();
  }

  createDialogNewShippingAddress() {
    this.shippingAddress = new ShippingAddress();
    this.shippingAddress.country_id = 14;
    this.shippingAddress.country_name = 'Österreich';
    this.shippingActionType = 'create';
    this.mainShippingAddressEditable = false;
    this.getCountries();
    this.shippingAddressDialog.show();
  }

  editShippingAddress(address: any) {
    if (this.mainShippingAddressEditable) {
      this.service
        .callPostMethod('/api/updateUser', this.shippingAddress)
        .subscribe((data) => {
          if (data) {
            this.shippingAddressDialog.hide();
            this.toastr.showSuccessCustom(
              '',
              this.language.generalSuccessfulyExecuteAction
            );
            this.selectShippingAddress(this.shippingAddress, true);
            this.getShippingAddresses();
          }
        });
    } else {
      this.service
        .callPostMethod('/api/updateShippingAddress', this.shippingAddress)
        .subscribe((data) => {
          if (data) {
            this.shippingAddressDialog.hide();
            this.toastr.showSuccessCustom(
              '',
              this.language.generalSuccessfulyExecuteAction
            );
            this.selectShippingAddress(this.shippingAddress, false);
            this.getShippingAddresses();
          }
        });
    }
  }

  deleteShippingAddress(address: any) {
    this.service
      .callPostMethod('/api/deleteShippingAddress', address)
      .subscribe((data) => {
        if (data) {
          this.toastr.showSuccessCustom(
            '',
            this.language.generalSuccessfulyExecuteAction
          );
          this.shippingAddress = new ShippingAddress();
          this.getShippingAddresses();
        }
      });
  }

  createNewShippingAddress() {
    this.service
      .callPostMethod('/api/createShippingAddress', this.shippingAddress)
      .subscribe((data) => {
        if (data) {
          this.shippingAddressDialog.hide();
          this.toastr.showSuccessCustom(
            '',
            this.language.generalSuccessfulyExecuteAction
          );
          this.getShippingAddresses();
          this.selectShippingAddress(this.shippingAddress, false);
        }
      });
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }

    // this.helpService.setSessionStorage('step', this.currentStep);
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
    // this.helpService.setSessionStorage('step', this.currentStep);
  }

  getPaymentOption() {
    return PaymentOption;
  }

  getUserType() {
    return UserType;
  }

  selectShippingAddress(address: any, mainShippingAddress: boolean) {
    this.storageService.setLocalStorage('shipping', address);
    this.mainShippingAddressEditable = mainShippingAddress;
    this.shippingAddress = address;
  }

  successEmitter(event: any) {
    this.currentStep++;
  }

  setPaymentOption(option: string, payment: PaymentOption) {
    this.paymentOption = payment;
    this.paymentOptionSelect = option;
    this.helpService.setSessionStorage('payment', option);
  }

  getCountries() {
    if (!this.countries) {
      this.service.callGetMethod('/api/getCountries', '').subscribe((data) => {
        this.countries = data;
      });
    }
  }

  removeCart(index: number) {
    this.products.splice(index, 1);
    this.storageService.setCookieObject('cart', this.products);
    this.toastr.showSuccessCustom(
      '',
      this.language.productSuccessfulyRemoveArticleFromCart
    );
    this.checkSubtotal();
    this.messageService.sentRefreshCartInformation();
  }

  checkSubtotal() {
    this.subOfProductInCart = 0;
    for (let i = 0; i < this.products.length; i++) {
      this.subOfProductInCart +=
        this.products[i].price * this.products[i].quantity;
    }
  }

  addQuantity(index: number) {
    this.products[index].quantity += 1;
    this.checkSubtotal();
    this.helpService.addNewQuantityToCart(
      this.products[index],
      this.products[index].quantity
    );
  }

  removeQuantity(index: number) {
    if (this.products[index].quantity > 1) {
      this.products[index].quantity -= 1;
      this.checkSubtotal();
      this.helpService.addNewQuantityToCart(
        this.products[index],
        this.products[index].quantity
      );
    }
  }

  changeCountry(event: any) {
    console.log(event);
    this.shippingAddress.country_name = event.itemData.name;
  }

  getPricePerItem(price: number, quantity: number) {
    return Number(price * quantity).toFixed(2);
  }
}
