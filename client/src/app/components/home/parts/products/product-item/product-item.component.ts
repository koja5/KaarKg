import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() item: any;
  @Input() accountType: any;
  @Output() hideProductItemDialogEvent = new EventEmitter();
  public quantity = 1;
  public language: any;
  public showHideDescriptionText = '';
  public showViewCartOption = false;

  constructor(
    private helpService: HelpService,
    private messageService: MessageService
  ) {}

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

  addToCart() {
    this.showViewCartOption = true;
    this.helpService.addToCart(this.item);
  }

  showViewCart() {
    this.messageService.sentViewCart();
    this.hideProductItemDialogEvent.emit();
  }
}
