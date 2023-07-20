import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderTopComponent } from '../common/header-top/header-top.component';
import { MatIconModule } from '@angular/material/icon';
import { MatIconComponent } from '../../common/mat-icon/mat-icon.component';
import { RightCardComponent } from '../common/right-card/right-card.component';
import { FooterComponent } from '../common/footer/footer.component';

@NgModule({
  declarations: [
    HeaderTopComponent,
    MatIconComponent,
    RightCardComponent,
  ],
  imports: [CommonModule, MatIconModule],
  exports: [
    HeaderTopComponent,
    MatIconComponent,
    RightCardComponent,
  ],
  providers: [],
  bootstrap: [],
})
export class SharingHomeModule {}
