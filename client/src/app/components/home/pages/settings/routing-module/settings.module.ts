import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicModule } from 'src/app/components/dynamic-component/dynamic-module/dynamic/dynamic.module';
import { ChangePasswordComponent } from '../items/change-password/change-password.component';
import { SettingsRouting } from './settings-routing';
import { ChangePersonalInfoComponent } from '../items/change-personal-info/change-personal-info.component';

@NgModule({
  declarations: [ChangePasswordComponent, ChangePersonalInfoComponent],
  imports: [CommonModule, SettingsRouting, DynamicModule],
  providers: [],
})
export class SettingsdModule {}
