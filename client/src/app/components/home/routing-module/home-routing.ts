import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home.component';
import { DocumentComponent } from '../pages/documents/document.component';
import { PaymentSuccessComponent } from '../../templates/payment-success/payment-success.component';
import { PaymentErrorComponent } from '../../templates/payment-error/payment-error.component';
import { CheckoutComponent } from '../pages/checkout/checkout.component';
import { AboutUsComponent } from '../pages/about-us/about-us.component';
import { ArticleDetailsComponent } from '../pages/article-details/article-details.component';
import { HelpComponent } from '../pages/help/help.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { ProductsComponent } from '../parts/products/products.component';
import { ImpressumComponent } from '../pages/documents/impressum/impressum.component';
import { TermsComponent } from '../pages/documents/terms/terms.component';
import { CookieComponent } from '../common/cookie/cookie.component';
import { PrivacyPolicyComponent } from '../pages/documents/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'category/:category',
    component: ProductsComponent,
  },
  {
    path: 'document',
    component: DocumentComponent,
    loadChildren: () =>
      import('../pages/documents/routing-module/document.module').then(
        (m) => m.DocumentModule
      ),
  },
  {
    path: 'article/:id',
    component: ArticleDetailsComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'payment-success/:sessionId',
    component: PaymentSuccessComponent,
  },
  {
    path: 'payment-error',
    component: PaymentErrorComponent,
  },
  {
    path: 'ueber-uns',
    component: AboutUsComponent,
  },
  {
    path: 'hilfe',
    component: HelpComponent,
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
  },
  {
    path: 'agb',
    component: TermsComponent,
  },
  {
    path: 'cookie',
    component: CookieComponent,
  },
  {
    path: 'datenschutz',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
    loadChildren: () =>
      import('../pages/settings/routing-module/settings.module').then(
        (m) => m.SettingsdModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomedRouting {}
