import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { LoaderSvgComponent } from './components/common/loader-svg/loader-svg.component';
import { LoaderComponent } from './components/common/loader/loader.component';
import { LoaderContentComponent } from './components/dynamic-component/common/loader-content/loader-content.component';
import { InvoiceComponent } from './components/templates/invoice/invoice.component';
import { NotFoundComponent } from './components/templates/not-found/not-found.component';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { BackButtonComponent } from './components/common/back-button/back-button.component';
import { SharingHomeModule } from './components/home/routing-module/share-home.module';

@NgModule({
  declarations: [
    LoaderComponent,
    LoaderSvgComponent,
    LoaderContentComponent,
    NotFoundComponent,
    InvoiceComponent,
    ConfirmDialogComponent,
    BackButtonComponent
  ],
  imports: [CommonModule, DialogModule, SharingHomeModule],
  exports: [
    LoaderComponent,
    LoaderSvgComponent,
    LoaderContentComponent,
    NotFoundComponent,
    InvoiceComponent,
    ConfirmDialogComponent,
    BackButtonComponent
  ],
  providers: [ConfirmDialogComponent],
  bootstrap: [],
})
export class SharingModule {}
