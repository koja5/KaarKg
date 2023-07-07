import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrComponent } from './components/common/toastr/toastr.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { DynamicModule } from './components/dynamic-component/dynamic-module/dynamic/dynamic.module';

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
  ],
  providers: [ToastrComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
