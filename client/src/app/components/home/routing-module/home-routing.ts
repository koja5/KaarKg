import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home.component';
import { DocumentComponent } from '../pages/documents/document.component';
import { PaymentSuccessComponent } from '../../templates/payment-success/payment-success.component';
import { PaymentErrorComponent } from '../../templates/payment-error/payment-error.component';
import { PaymentComponent } from '../pages/payment/payment.component';
import { CheckoutComponent } from '../pages/checkout/checkout.component';
import { AboutUsComponent } from '../pages/about-us/about-us.component';
import { ArticleDetailsComponent } from '../pages/article-details/article-details.component';
import { HelpComponent } from '../pages/help/help.component';
import { SettingsComponent } from '../pages/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'category/KAPLA-Bausteine',
    component: HomeComponent,
  },
  {
    path: 'category/:category',
    component: HomeComponent,
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
    path: 'payment',
    component: PaymentComponent,
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
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: 'recovery-password/:email',
    component: HelpComponent,
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
