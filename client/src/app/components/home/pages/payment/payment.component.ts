import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ConfirmDialogComponent } from 'src/app/components/common/confirm-dialog/confirm-dialog.component';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { PaymentOption } from 'src/app/enums/payment-option';
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
  public paymentOption: PaymentOption = PaymentOption.prepayment;
  public loader = false;
  public shippingAddress = new ShippingAddress();
  public shippingActionType = '';
  public confirmDialogComponent = new ConfirmDialogComponent();

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

    this.service.callGetMethod('/api/getMyShippingAddress', '').subscribe(
      (data: any) => {
        this.user = data[0];
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
      ' ' +
      value.address +
      ', Telephone: ' +
      value.telephone +
      ', Email: ' +
      value.email
    );
  }

  editDialogShippingAddress(address: any) {
    this.shippingAddress = address;
    this.shippingActionType = 'edit';
    this.shippingAddressDialog.show();
  }

  deleteDialogShippingAddress(address: any) {
    this.confirmDialogComponent.showDialog();
  }

  createDialogNewShippingAddress() {
    this.shippingAddress = new ShippingAddress();
    this.shippingActionType = 'create';
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
        }
      });
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (this.paymentOption === PaymentOption.pay) {
        const products = this.storageService.getCookieObject('cart');
        this.service.checkout(products);
      } else if (this.paymentOption === PaymentOption.prepayment) {
        this.loader = true;
        setTimeout(() => {
          this.loader = false;
          this.router.navigate(['/checkout']);
        }, 350);
      }
    } else {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  getPaymentOption() {
    return PaymentOption;
  }

  selectShippingAddress(address: any) {
    this.storageService.setLocalStorage('shipping', address);
  }
}
