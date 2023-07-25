import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ConfirmDialogComponent } from 'src/app/components/common/confirm-dialog/confirm-dialog.component';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { PaymentOption } from 'src/app/enums/payment-option';
import { UserType } from 'src/app/enums/user-type';
import { ShippingAddress } from 'src/app/models/shipping-address-model';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @ViewChild('shippingAddressDialog') shippingAddressDialog!: DialogComponent;
  public user: any;
  public shippingAddresses: any;
  public language: any;
  currentStep = 0;
  public paymentOption: PaymentOption = PaymentOption.invoice;
  public paymentOptionSelect: string | undefined;
  public userType!: UserType;
  public loader = false;
  public shippingAddress = new ShippingAddress();
  public shippingActionType = '';
  public confirmDialogComponent = new ConfirmDialogComponent();
  public type: number | undefined;
  public countries: any;

  constructor(
    private service: CallApiService,
    private helpService: HelpService,
    private storageService: StorageService,
    private router: Router,
    private toastr: ToastrComponent
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initialize();
  }

  initialize() {
    this.getShippingAddresses();
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
        this.storageService.setLocalStorage('shipping', this.user);
        this.shippingAddress = this.user;
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
      value.telephone +
      ', ' +
      value.email
    );
  }

  editDialogShippingAddress(address: any) {
    this.shippingAddress = address;
    this.shippingActionType = 'edit';
    this.getCountries();
    this.shippingAddressDialog.show();
  }

  deleteDialogShippingAddress(address: any) {
    this.confirmDialogComponent.showDialog();
  }

  createDialogNewShippingAddress() {
    this.shippingAddress = new ShippingAddress();
    this.shippingAddress.country_id = 14;
    this.shippingActionType = 'create';
    this.getCountries();
    this.shippingAddressDialog.show();
  }

  editShippingAddress(address: any) {
    this.service
      .callPostMethod('/api/updateShippingAddress', this.shippingAddress)
      .subscribe((data) => {
        if (data) {
          this.shippingAddressDialog.hide();
          this.toastr.showSuccessCustom(
            '',
            this.language.generalSuccessfulyExecuteAction
          );
          this.getShippingAddresses();
        }
      });
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
          this.storageService.setLocalStorage('shipping', this.shippingAddress);
        }
      });
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    // this.currentStep++;
    // if (this.currentStep === 1 && this.paymentOption === PaymentOption.pay) {
    //   const products = this.storageService.getCookieObject('cart');
    //   this.service.checkout(products);
    // } else {
    //   this.currentStep++;
    // }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  getPaymentOption() {
    return PaymentOption;
  }

  getUserType() {
    return UserType;
  }

  selectShippingAddress(address: any) {
    this.storageService.setLocalStorage('shipping', address);
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
}
