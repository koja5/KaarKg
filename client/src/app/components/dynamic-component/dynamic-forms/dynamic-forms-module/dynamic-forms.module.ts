import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFieldsDirective } from '../dynamic-fields/dynamic-fields.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ColorPickerComponent,
  ColorPickerModule,
  NumericTextBoxModule,
  TextBoxModule,
} from '@syncfusion/ej2-angular-inputs';
import {
  ButtonModule,
  CheckBoxModule,
  RadioButtonModule,
  SwitchModule,
} from '@syncfusion/ej2-angular-buttons';
import { TextBoxComponent } from '../dynamic-fields/inputs/text-box/text-box.component';
import { LabelComponent } from '../dynamic-fields/label/label.component';
import { ButtonComponent } from '../dynamic-fields/buttons/button/button.component';
import { DynamicIconComponent } from '../../common/dynamic-icon/dynamic-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { SharingModule } from 'src/app/sharing.module';
import { ComboboxComponent } from '../dynamic-fields/dropdowns/combobox/combobox.component';
import {
  ComboBoxModule,
  MultiSelectModule,
} from '@syncfusion/ej2-angular-dropdowns';
import {
  DatePickerModule,
  DateTimePickerAllModule,
} from '@syncfusion/ej2-angular-calendars';
import { DatepickerComponent } from '../dynamic-fields/inputs/datepicker/datepicker.component';
import { NumericTextboxComponent } from '../dynamic-fields/inputs/numeric-textbox/numeric-textbox.component';
import { SwitchComponent } from '../dynamic-fields/buttons/switch/switch.component';
import { DatetimepickerComponent } from '../dynamic-fields/inputs/datetimepicker/datetimepicker.component';
import { MultiselectComponent } from '../dynamic-fields/dropdowns/multiselect/multiselect.component';
import { ColorpickerComponent } from '../dynamic-fields/inputs/colorpicker/colorpicker.component';

@NgModule({
  declarations: [
    DynamicFieldsDirective,
    TextBoxComponent,
    LabelComponent,
    ButtonComponent,
    DynamicIconComponent,
    ComboboxComponent,
    MultiselectComponent,
    DatepickerComponent,
    DatetimepickerComponent,
    NumericTextboxComponent,
    SwitchComponent,
    ColorpickerComponent,
  ],
  exports: [
    DynamicFieldsDirective,
    TextBoxComponent,
    LabelComponent,
    ButtonComponent,
    DynamicIconComponent,
    ComboboxComponent,
    DatepickerComponent,
    DatetimepickerComponent,
    NumericTextboxComponent,
    SwitchComponent,
    ColorpickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    ButtonModule,
    CheckBoxModule,
    RadioButtonModule,
    SwitchModule,
    MatIconModule,
    SharingModule,
    ComboBoxModule,
    MultiSelectModule,
    DatePickerModule,
    DateTimePickerAllModule,
    NumericTextBoxModule,
    SwitchModule,
    ColorPickerModule,
  ],
  entryComponents: [
    DynamicFieldsDirective,
    TextBoxComponent,
    LabelComponent,
    ButtonComponent,
    DynamicIconComponent,
    ComboboxComponent,
    MultiselectComponent,
    DatepickerComponent,
    DatetimepickerComponent,
    NumericTextboxComponent,
    SwitchComponent,
    ColorpickerComponent,
  ],
})
export class DynamicFormsModule {}
