import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from '../../dynamic-forms/dynamic-forms.component';
import { DynamicActionButtonComponent } from '../../dynamic-action-button/dynamic-action-button.component';
import { DynamicFormsModule } from '../../dynamic-forms/dynamic-forms-module/dynamic-forms.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharingModule } from 'src/app/sharing.module';
import { ToastrComponent } from '../../common/toastr/toastr.component';
import { DialogModalComponent } from 'src/app/components/common/dialog-modal/dialog-modal.component';
import { DialogAllModule } from '@syncfusion/ej2-angular-popups';
import {
  ContextMenuService,
  EditService,
  ExcelExportService,
  FilterService,
  GridModule,
  GroupService,
  PageService,
  PdfExportService,
  ResizeService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import {
  AgendaService,
  DayService,
  MonthService,
  WeekService,
  WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
import {
  DropDownButtonModule,
  SplitButtonModule,
} from '@syncfusion/ej2-angular-splitbuttons';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { DynamicGridComponent } from '../../dynamic-grid/dynamic-grid.component';
import { DynamicTextFormComponent } from '../../dynamic-text-form/dynamic-text-form.component';

@NgModule({
  declarations: [
    DynamicGridComponent,
    DynamicFormsComponent,
    DynamicActionButtonComponent,
    DialogModalComponent,
    ToastrComponent,
    DynamicTextFormComponent
  ],
  exports: [
    DynamicGridComponent,
    DynamicFormsComponent,
    DynamicActionButtonComponent,
    DialogModalComponent,
    ToastrComponent,
    DynamicTextFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicFormsModule,
    SharingModule,
    DialogAllModule,
    SplitButtonModule,
    DropDownButtonModule,
    ToastrModule.forRoot(),
    GridModule,
    MatIconModule,
  ],
  providers: [
    EditService,
    PdfExportService,
    ExcelExportService,
    ToolbarService,
    SortService,
    FilterService,
    ContextMenuService,
    PageService,
    GroupService,
    ResizeService,
    ToastrComponent,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
  ],
  entryComponents: [DynamicFormsComponent],
})
export class DynamicModule {}
