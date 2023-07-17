import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-right-card',
  templateUrl: './right-card.component.html',
  styleUrls: ['./right-card.component.scss'],
})
export class RightCardComponent implements OnInit {
  @Input() rightCard: any;
  @Input() type: any;
  @Output() needToLoginEmitter = new EventEmitter();
  @Output() closeCardEmitter = new EventEmitter();

  public products: any;
  public language: any;
  public subOfProductInCart = 0;

  constructor(
    private storageService: StorageService,
    private helpService: HelpService,
    private service: CallApiService,
    private toastr: ToastrComponent,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type === 'favorite') {
      this.products = this.storageService.getCookieObject('favorite');
    } else if (this.type === 'cart') {
      this.products = this.storageService.getCookieObject('cart');
      this.checkSubtotal();
    }
  }

  checkSubtotal() {
    this.subOfProductInCart = 0;
    for (let i = 0; i < this.products.length; i++) {
      this.subOfProductInCart += this.products[i].price;
    }
  }

  removeFavorite(index: number) {
    this.products.splice(index, 1);
    this.storageService.setCookieObject('favorite', this.products);
    this.toastr.showSuccessCustom(
      '',
      this.language.productSuccessfulyRemoveArticleFromFavorite
    );
  }

  removeCart(index: number) {
    this.products.splice(index, 1);
    this.storageService.setCookieObject('cart', this.products);
    this.toastr.showSuccessCustom(
      '',
      this.language.productSuccessfulyRemoveArticleFromCart
    );
    this.checkSubtotal();
    this.messageService.sentRefreshCartInformation();
  }

  onCheckout(): void {
    if (this.storageService.getToken()) {
      this.router.navigate(['payment']);
    } else {
      this.rightCard = '';
      this.toastr.showInfoCustom('', this.language.paymentNeedToLogin);
      this.needToLoginEmitter.emit();
    }
  }
}
