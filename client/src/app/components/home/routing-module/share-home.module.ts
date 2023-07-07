import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderTopComponent } from '../common/header-top/header-top.component';
import { MatIconModule } from '@angular/material/icon';
import { MatIconComponent } from '../../common/mat-icon/mat-icon.component';

@NgModule({
  declarations: [HeaderTopComponent, MatIconComponent],
  imports: [CommonModule, MatIconModule],
  exports: [HeaderTopComponent, MatIconComponent],
  providers: [],
  bootstrap: [],
})
export class SharingHomeModule {}
