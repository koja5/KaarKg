import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() item: any;
  @Input() accountType: any;
  @Output() hideProductItemDialogEvent = new EventEmitter();
  public language: any;
  public showHideDescriptionText = '';
  public showViewCartOption = false;

  constructor(
    private helpService: HelpService,
    private router: Router,
    private toastr: ToastrComponent,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    if (this.item && !this.item.quantity) {
      this.item.quantity = 1;
    } else if (!this.item) {
      setTimeout(() => {
        this.item.quantity = 1;
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showHideDescriptionText = '';
  }

  addQuantity() {
    this.item.quantity += 1;
    this.helpService.addNewQuantityToCart(this.item, this.item.quantity);
  }

  removeQuantity() {
    if (this.item.quantity > 1) {
      this.item.quantity -= 1;
      this.helpService.addNewQuantityToCart(this.item, this.item.quantity);
    }
  }

  addToCart() {
    this.showViewCartOption = true;
    this.helpService.addToCart(this.item);
  }

  addToFavorite() {
    this.helpService.addToFavorite(this.item);
  }

  showViewCart() {
    if (this.storageService.getToken()) {
      this.router.navigate(['payment']);
    } else {
      this.toastr.showInfoCustom('', this.language.paymentNeedToLogin);
    }
  }

  copyToClipboard() {
    const link = window.location.origin + '/article/' + this.item.id;
    navigator.clipboard.writeText(link).then(
      () => {
        this.toastr.showSuccessCustom(
          '',
          this.language.productSuccessfulyCopyLinkToClipboard
        );
      },
      () => {
        this.toastr.showErrorCustom(
          '',
          this.language.productErrorCopyLinkToClipboard
        );
      }
    );
  }

  getNoImageAvailablePicture() {
    this.item['image'] = '../no-image.png';
  }
}
