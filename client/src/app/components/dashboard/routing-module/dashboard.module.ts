import { NgModule } from '@angular/core';
import { DashboardComponent } from '../dashboard.component';
import { DashboardRouting } from './dashboard-routing';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationProductComponent } from '../pages/navigation-product/navigation-product.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { FormsModule } from '@angular/forms';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { DynamicModule } from '../../dynamic-component/dynamic-module/dynamic/dynamic.module';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { AllUsersComponent } from '../pages/all-users/all-users.component';
import { AllProductsComponent } from '../pages/all-products/all-products.component';
import { UploaderAllModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [DashboardComponent, NavigationProductComponent, AllUsersComponent, AllProductsComponent],
  imports: [
    CommonModule,
    DashboardRouting,
    MatIconModule,
    GridModule,
    ButtonModule,
    TreeViewModule,
    DialogModule,
    FormsModule,
    DropDownButtonModule,
    ComboBoxModule,
    DynamicModule,
    UploaderAllModule
  ],
  providers: [],
})
export class DashboardModule {}
