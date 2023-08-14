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
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
