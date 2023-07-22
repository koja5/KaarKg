import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from '../items/change-password/change-password.component';
import { ChangePersonalInfoComponent } from '../items/change-personal-info/change-personal-info.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'change-personal-info',
  },
  {
    path: 'change-personal-info',
    component: ChangePersonalInfoComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRouting {}
