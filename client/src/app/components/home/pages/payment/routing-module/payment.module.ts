import { NgModule } from '@angular/core';
import { PaymentComponent } from '../payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharingHomeModule } from '../../../routing-module/share-home.module';
import { SharingModule } from 'src/app/sharing.module';
import { CommonModule } from '@angular/common';
import { HomedRouting } from '../../../routing-module/home-routing';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import {
  ButtonModule,
  CheckBoxModule,
  RadioButtonAllModule,
} from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { MatIconModule } from '@angular/material/icon';
import { DynamicModule } from 'src/app/components/dynamic-component/dynamic-module/dynamic/dynamic.module';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { CheckoutComponent } from '../../checkout/checkout.component';
import { StripeModule } from 'stripe-angular';
import { PaymentRouting } from './payment-routing';
import { OverviewComponent } from '../overview/overview.component';
import { RouterModule } from '@angular/router';
import { PaymentSuccessComponent } from 'src/app/components/templates/payment-success/payment-success.component';
import { PaymentErrorComponent } from 'src/app/components/templates/payment-error/payment-error.component';
import { environment } from '../../../../../../environments/environment';

@NgModule({
  declarations: [
    PaymentComponent,
    OverviewComponent,
    CheckoutComponent,
    PaymentSuccessComponent,
    PaymentErrorComponent,
  ],
  imports: [
    PaymentRouting,
    FormsModule,
    CommonModule,
    FormsModule,
    DialogModule,
    ComboBoxAllModule,
    MatIconModule,
    SharingHomeModule,
    SharingModule,
    RadioButtonAllModule,
    StripeModule.forRoot(environment.code),
  ],
  providers: [],
})
export class PaymentModule {}
