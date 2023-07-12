import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home.component';
import { DocumentComponent } from '../pages/documents/document.component';
import { PaymentSuccessComponent } from '../../templates/payment-success/payment-success.component';
import { PaymentErrorComponent } from '../../templates/payment-error/payment-error.component';

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
    path: 'payment-success/:sessionId',
    component: PaymentSuccessComponent,
  },
  {
    path: 'payment-error',
    component: PaymentErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomedRouting {}
