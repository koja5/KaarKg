import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomedRouting } from './home-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from '../home.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { LoginComponent } from '../parts/login/login.component';
import {
  ButtonModule,
  CheckBoxModule,
  RadioButtonAllModule,
} from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';
import { NavigationComponent } from '../parts/navigation/navigation.component';
import { ProductsComponent } from '../parts/products/products.component';
import { ProductItemComponent } from '../parts/products/product-item/product-item.component';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { CookieComponent } from '../common/cookie/cookie.component';
import { SharingHomeModule } from './share-home.module';
import { SharingModule } from 'src/app/sharing.module';
import { AboutUsComponent } from '../pages/about-us/about-us.component';
import { DynamicModule } from '../../dynamic-component/dynamic-module/dynamic/dynamic.module';
import { FooterComponent } from '../common/footer/footer.component';
import { ArticleDetailsComponent } from '../pages/article-details/article-details.component';
import { HelpComponent } from '../pages/help/help.component';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { SettingsComponent } from '../pages/settings/settings.component';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { StripeModule } from 'stripe-angular';
import { RecoveryPasswordComponent } from '../parts/login/recovery-password/recovery-password.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    NavigationComponent,
    ProductsComponent,
    ProductItemComponent,
    CookieComponent,
    AboutUsComponent,
    FooterComponent,
    ArticleDetailsComponent,
    HelpComponent,
    SettingsComponent,
    RecoveryPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomedRouting,
    DialogModule,
    ButtonModule,
    DropDownButtonAllModule,
    ComboBoxAllModule,
    NumericTextBoxAllModule,
    MatIconModule,
    SharingHomeModule,
    SharingModule,
    ReactiveFormsModule,
    CheckBoxModule,
    DynamicModule,
    AccordionModule,
  ],
  providers: [],
})
export class HomedModule {}
