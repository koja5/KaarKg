import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProductComponent } from '../pages/navigation-product/navigation-product.component';
import { AllUsersComponent } from '../pages/all-users/all-users.component';
import { AllProductsComponent } from '../pages/all-products/all-products.component';
import { CountriesComponent } from '../pages/countries/countries.component';
import { ShippingPricesComponent } from '../pages/shipping-prices/shipping-prices.component';
import { MailVerifyConfigComponent } from '../pages/mail-configuration/mail-verify-config/mail-verify-config.component';
import { MailVerifyKindergardenConfigComponent } from '../pages/mail-configuration/mail-verify-kindergarden-config/mail-verify-kindergarden-config.component';
import { MailVerifyDealerConfigComponent } from '../pages/mail-configuration/mail-verify-dealer-config/mail-verify-dealer-config.component';
import { MailApproveKindergardenConfigComponent } from '../pages/mail-configuration/mail-approve-kindergarden-config/mail-approve-kindergarden-config.component';
import { MailApproveDealerConfigComponent } from '../pages/mail-configuration/mail-approve-dealer-config/mail-approve-dealer-config.component';
import { MailResetPasswordConfigComponent } from '../pages/mail-configuration/mail-reset-password-config/mail-reset-password-config.component';
import { MailApprovedDealerAccountInfoConfigComponent } from '../pages/mail-configuration/mail-approved-account-info-config/mail-approved-dealer-account-info-config.component';
import { MailChangeUserDataConfigComponent } from '../pages/mail-configuration/mail-change-user-data-config/mail-change-user-data-config.component';
import { MailInvoiceCustomerConfigComponent } from '../pages/mail-configuration/mail-invoice-customer-config/mail-invoice-customer-config.component';
import { MailInvoiceSuperadminConfigComponent } from '../pages/mail-configuration/mail-invoice-superadmin-config/mail-invoice-superadmin-config.component';
import { TextConfigurationComponent } from '../pages/text-configuration/text-configuration.component';
import { MailApprovedKindergardenInfoConfigComponent } from '../pages/mail-configuration/mail-approved-kindergarden-info-config/mail-approved-kindergarden-info-config.component';
import { MailRejectedDealerInfoConfigComponent } from '../pages/mail-configuration/mail-rejected-dealer-info-config/mail-rejected-dealer-info-config.component';
import { MailRejectedKindergardenInfoConfigComponent } from '../pages/mail-configuration/mail-rejected-kindergarden-info-config/mail-rejected-kindergarden-info-config.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'navigation-product',
    pathMatch: 'full',
  },
  {
    path: 'navigation-product',
    component: NavigationProductComponent,
  },
  {
    path: 'all-users',
    component: AllUsersComponent,
  },
  {
    path: 'all-products',
    component: AllProductsComponent,
  },
  {
    path: 'shipping-prices',
    component: ShippingPricesComponent,
  },
  {
    path: 'countries',
    component: CountriesComponent,
  },
  {
    path: 'mail-verify-config',
    component: MailVerifyConfigComponent,
  },
  {
    path: 'mail-verify-kindergarden-config',
    component: MailVerifyKindergardenConfigComponent,
  },
  {
    path: 'mail-verify-dealer-config',
    component: MailVerifyDealerConfigComponent,
  },
  {
    path: 'mail-approve-kindergarden-config',
    component: MailApproveKindergardenConfigComponent,
  },
  {
    path: 'mail-approve-dealer-config',
    component: MailApproveDealerConfigComponent,
  },
  {
    path: 'mail-approved-dealer-account-info-config',
    component: MailApprovedDealerAccountInfoConfigComponent,
  },
  {
    path: 'mail-approved-kindergarden-account-info-config',
    component: MailApprovedKindergardenInfoConfigComponent,
  },
  {
    path: 'mail-rejected-dealer-account-info-config',
    component: MailRejectedDealerInfoConfigComponent,
  },
  {
    path: 'mail-rejected-kindergarden-account-info-config',
    component: MailRejectedKindergardenInfoConfigComponent,
  },
  {
    path: 'mail-reset-password-config',
    component: MailResetPasswordConfigComponent,
  },
  {
    path: 'mail-change-user-data-config',
    component: MailChangeUserDataConfigComponent,
  },
  {
    path: 'mail-invoice-customer-config',
    component: MailInvoiceCustomerConfigComponent,
  },
  {
    path: 'mail-invoice-superadmin-config',
    component: MailInvoiceSuperadminConfigComponent,
  },
  {
    path: 'text-config',
    component: TextConfigurationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRouting {}
