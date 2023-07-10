import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginGuardService } from './services/login-guard/login-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/home/routing-module/home.module').then(
        (m) => m.HomedModule
      ),
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
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
