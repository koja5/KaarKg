import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentOption } from 'src/app/enums/payment-option';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  public user: any;
  public shippingAddress = [];
  public language: any;
  currentStep = 0;
  public paymentOption: PaymentOption = PaymentOption.prepayment;

  constructor(
    private service: CallApiService,
    private helpService: HelpService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initialize();
  }

  initialize() {
    this.service.callGetMethod('/api/getMe', '').subscribe((data: any) => {
      this.user = data[0];
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

  editShippingAddress() {}

  deleteShippingAddress() {}

  createNewShippingAddress() {}

  nextStep() {
    if (this.currentStep === 1) {
      if (this.paymentOption === PaymentOption.pay) {
        const products = this.storageService.getCookieObject('cart');
        this.service.checkout(products);
      } else if(this.paymentOption === PaymentOption.prepayment) {
        this.router.navigate(['/checkout'])
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
}
