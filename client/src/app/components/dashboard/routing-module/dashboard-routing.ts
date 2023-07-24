import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationProductComponent } from '../pages/navigation-product/navigation-product.component';
import { AllUsersComponent } from '../pages/all-users/all-users.component';
import { AllProductsComponent } from '../pages/all-products/all-products.component';
import { CountriesComponent } from '../pages/countries/countries.component';
import { ShippingPricesComponent } from '../pages/shipping-prices/shipping-prices.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRouting {}
