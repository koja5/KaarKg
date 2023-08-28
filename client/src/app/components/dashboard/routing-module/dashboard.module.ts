import { NgModule } from '@angular/core';
import { DashboardComponent } from '../dashboard.component';
import { DashboardRouting } from './dashboard-routing';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationProductComponent } from '../pages/navigation-product/navigation-product.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { FormsModule } from '@angular/forms';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { DynamicModule } from '../../dynamic-component/dynamic-module/dynamic/dynamic.module';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { AllUsersComponent } from '../pages/all-users/all-users.component';
import { AllProductsComponent } from '../pages/all-products/all-products.component';
import { UploaderAllModule } from '@syncfusion/ej2-angular-inputs';
import { CountriesComponent } from '../pages/countries/countries.component';
import { ShippingPricesComponent } from '../pages/shipping-prices/shipping-prices.component';
import { SharingModule } from 'src/app/sharing.module';
import { MailVerifyConfigComponent } from '../pages/mail-configuration/mail-verify-config/mail-verify-config.component';
import { MailVerifyKindergardenConfigComponent } from '../pages/mail-configuration/mail-verify-kindergarden-config/mail-verify-kindergarden-config.component';
import { MailVerifyDealerConfigComponent } from '../pages/mail-configuration/mail-verify-dealer-config/mail-verify-dealer-config.component';
import { MailApproveKindergardenConfigComponent } from '../pages/mail-configuration/mail-approve-kindergarden-config/mail-approve-kindergarden-config.component';
import { MailApproveDealerConfigComponent } from '../pages/mail-configuration/mail-approve-dealer-config/mail-approve-dealer-config.component';
import { MailResetPasswordConfigComponent } from '../pages/mail-configuration/mail-reset-password-config/mail-reset-password-config.component';
import { MailApprovedAccountInfoConfigComponent } from '../pages/mail-configuration/mail-approved-account-info-config/mail-approved-account-info-config.component';
import { MailChangeUserDataConfigComponent } from '../pages/mail-configuration/mail-change-user-data-config/mail-change-user-data-config.component';
import { MailInvoiceCustomerConfigComponent } from '../pages/mail-configuration/mail-invoice-customer-config/mail-invoice-customer-config.component';
import { MailInvoiceSuperadminConfigComponent } from '../pages/mail-configuration/mail-invoice-superadmin-config/mail-invoice-superadmin-config.component';
import { TextConfigurationComponent } from '../pages/text-configuration/text-configuration.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavigationProductComponent,
    AllUsersComponent,
    AllProductsComponent,
    CountriesComponent,
    ShippingPricesComponent,
    MailVerifyConfigComponent,
    MailVerifyKindergardenConfigComponent,
    MailVerifyDealerConfigComponent,
    MailApproveKindergardenConfigComponent,
    MailApproveDealerConfigComponent,
    MailApprovedAccountInfoConfigComponent,
    MailResetPasswordConfigComponent,
    MailChangeUserDataConfigComponent,
    MailInvoiceCustomerConfigComponent,
    MailInvoiceSuperadminConfigComponent,
    TextConfigurationComponent
  ],
  imports: [
    CommonModule,
    DashboardRouting,
    MatIconModule,
    GridModule,
    ButtonModule,
    TreeViewModule,
    DialogModule,
    FormsModule,
    DropDownButtonModule,
    ComboBoxModule,
    DynamicModule,
    UploaderAllModule,
    SharingModule,
  ],
  providers: [],
})
export class DashboardModule {}
