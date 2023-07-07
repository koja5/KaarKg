import { Component, Input, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() item: any;
  public quantity = 1;
  public language: any;
  public showHideDescriptionText = '';

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  addQuantity() {
    this.quantity += 1;
  }

  removeQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }
}
