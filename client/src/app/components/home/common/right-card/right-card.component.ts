import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { UserType } from 'src/app/enums/user-type';
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
  @ViewChild('quickView') quickView!: DialogComponent;
  @Input() rightCard: any;
  @Input() type: any;
  @Output() needToLoginEmitter = new EventEmitter();
  @Output() closeCardEmitter = new EventEmitter();
  @Output() showQuickView = new EventEmitter<any>();

  public products: any;
  public language: any;

  constructor(
    private storageService: StorageService,
    public helpService: HelpService,
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
      // this.checkRealProductPrice();
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

  addToCart(item: any) {
    item.quantity = 1;
    this.helpService.addToCart(item);
    this.messageService.sentRefreshCartInformation();
  }

  addQuantity(index: number) {
    this.products[index].quantity += 1;
    this.helpService.addNewQuantityToCart(
      this.products[index],
      this.products[index].quantity
    );
    this.messageService.sentRefreshCartInformation();
  }

  changeQuantity(index: number) {
    this.helpService.addNewQuantityToCart(
      this.products[index],
      this.products[index].quantity
    );
    this.messageService.sentRefreshCartInformation();
  }

  removeQuantity(index: number) {
    if (this.products[index].quantity > 1) {
      this.products[index].quantity -= 1;
      this.helpService.addNewQuantityToCart(
        this.products[index],
        this.products[index].quantity
      );
      this.messageService.sentRefreshCartInformation();
    }
  }

  getPricePerItem(price: number, quantity: number) {
    return Number(price * quantity).toFixed(2);
  }
}
