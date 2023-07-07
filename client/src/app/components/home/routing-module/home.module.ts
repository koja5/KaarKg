import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomedRouting } from './home-routing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from '../home.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { LoginComponent } from '../parts/login/login.component';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';
import { MatIconComponent } from '../../common/mat-icon/mat-icon.component';
import { NavigationComponent } from '../parts/navigation/navigation.component';
import { ProductsComponent } from '../parts/products/products.component';
import { ProductItemComponent } from '../parts/products/product-item/product-item.component';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { CookieComponent } from '../common/cookie/cookie.component';
import { SharingHomeModule } from './share-home.module';
import { SharingModule } from 'src/app/sharing.module';
@NgModule({
  declarations: [HomeComponent, LoginComponent, NavigationComponent, ProductsComponent, ProductItemComponent, CookieComponent],
  imports: [
    CommonModule,
    FormsModule,
    HomedRouting,
    DialogModule,
    ButtonModule,
    DropDownButtonAllModule,
    NumericTextBoxAllModule,
    MatIconModule,
    SharingHomeModule,
    SharingModule
  ],
  providers: [],
})
export class HomedModule {}
