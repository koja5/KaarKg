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
import { MailApprovedAccountInfoConfigComponent } from '../pages/mail-configuration/mail-approved-account-info-config/mail-approved-account-info-config.component';
import { MailChangeUserDataConfigComponent } from '../pages/mail-configuration/mail-change-user-data-config/mail-change-user-data-config.component';
import { MailInvoiceCustomerConfigComponent } from '../pages/mail-configuration/mail-invoice-customer-config/mail-invoice-customer-config.component';
import { MailInvoiceSuperadminConfigComponent } from '../pages/mail-configuration/mail-invoice-superadmin-config/mail-invoice-superadmin-config.component';

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
    path: 'mail-approved-account-info-config',
    component: MailApprovedAccountInfoConfigComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRouting {}
