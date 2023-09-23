import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderTopComponent } from '../common/header-top/header-top.component';
import { MatIconModule } from '@angular/material/icon';
import { MatIconComponent } from '../../common/mat-icon/mat-icon.component';
import { RightCardComponent } from '../common/right-card/right-card.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { PaymentAdditionalAmountComponent } from '../common/payment-additional-amount/payment-additional-amount.component';
import { NoProductsAvailableComponent } from '../common/no-products-available/no-products-available.component';

@NgModule({
  declarations: [
    HeaderTopComponent,
    MatIconComponent,
    RightCardComponent,
    PaymentAdditionalAmountComponent,
    NoProductsAvailableComponent
  ],
  imports: [CommonModule, MatIconModule, FormsModule],
  exports: [
    HeaderTopComponent,
    MatIconComponent,
    RightCardComponent,
    PaymentAdditionalAmountComponent,
    NoProductsAvailableComponent
  ],
  providers: [],
  bootstrap: [],
})
export class SharingHomeModule {}
