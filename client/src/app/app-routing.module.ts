import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginGuardService } from './services/login-guard/login-guard.service';
import { HomeComponent } from './components/home/home.component';
import { LoggedAnyService } from './services/login-guard/logged-any.service';
import { RecoveryPasswordComponent } from './components/home/parts/login/recovery-password/recovery-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    loadChildren: () =>
      import('./components/home/routing-module/home.module').then(
        (m) => m.HomedModule
      ),
  },
  {
    path: 'payment',
    canActivate: [LoggedAnyService],
    loadChildren: () =>
      import(
        './components/home/pages/payment/routing-module/payment.module'
      ).then((m) => m.PaymentModule),
  },
  {
    path: 'recovery-password/:email',
    component: RecoveryPasswordComponent,
  },
  {
    path: 'dashboard',
    canActivate: [LoginGuardService],
    component: DashboardComponent,
    loadChildren: () =>
      import('./components/dashboard/routing-module/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
