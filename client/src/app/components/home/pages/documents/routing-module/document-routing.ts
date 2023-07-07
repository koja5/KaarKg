import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImpressumComponent } from '../impressum/impressum.component';
import { TermsComponent } from '../terms/terms.component';
import { CookieComponent } from '../cookie/cookie.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: 'impressum',
    component: ImpressumComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'cookie',
    component: CookieComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentRouting {}
