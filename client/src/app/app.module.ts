import { NgModule } from '@angular/core';
import {
  BrowserModule,
  TransferState,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrComponent } from './components/common/toastr/toastr.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { DynamicModule } from './components/dynamic-component/dynamic-module/dynamic/dynamic.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { translateBrowserLoaderFactory } from 'src/translate-browser.loader';
import { TransferHttpCacheModule } from '@nguniversal/common';

@NgModule({
  declarations: [AppComponent, ToastrComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    DynamicModule,
    TransferHttpCacheModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    }),
  ],
  providers: [ToastrComponent, provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
