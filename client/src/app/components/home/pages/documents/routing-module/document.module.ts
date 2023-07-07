import { NgModule } from '@angular/core';
import { ImpressumComponent } from '../impressum/impressum.component';
import { DocumentRouting } from './document-routing';
import { DocumentComponent } from '../document.component';
import { SharingHomeModule } from '../../../routing-module/share-home.module';
import { DynamicModule } from 'src/app/components/dynamic-component/dynamic-module/dynamic/dynamic.module';
import { TermsComponent } from '../terms/terms.component';
import { CookieComponent } from '../cookie/cookie.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [DocumentComponent, ImpressumComponent, TermsComponent, CookieComponent, PrivacyPolicyComponent],
  imports: [DocumentRouting, SharingHomeModule, DynamicModule],
  providers: [],
})
export class DocumentModule {}
