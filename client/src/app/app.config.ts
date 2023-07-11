import { ApplicationConfig, enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from '../environments/environment';

import { registerLicense } from '@syncfusion/ej2-base';
import { AppComponent } from './app.component';
import { DynamicModule } from './components/dynamic-component/dynamic-module/dynamic/dynamic.module';
import { MatIconModule } from '@angular/material/icon';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {
  provideClientHydration,
  BrowserModule,
  bootstrapApplication,
} from '@angular/platform-browser';
import { ToastrComponent } from './components/common/toastr/toastr.component';

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      CommonModule,
      ToastrModule.forRoot(),
      AppRoutingModule,
      MatIconModule,
      DynamicModule
    ),
    ToastrComponent,
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
