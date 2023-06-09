import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProductComponent } from '../pages/navigation-product/navigation-product.component';
import { AllUsersComponent } from '../pages/all-users/all-users.component';
import { AllProductsComponent } from '../pages/all-products/all-products.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRouting {}
