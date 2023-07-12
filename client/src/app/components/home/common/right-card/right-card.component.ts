import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-right-card',
  templateUrl: './right-card.component.html',
  styleUrls: ['./right-card.component.scss'],
})
export class RightCardComponent implements OnInit {
  @Input() rightCard: any;
  @Input() type: any;

  public products: any;
  public language: any;

  constructor(
    private storageService: StorageService,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rightCard'].currentValue) {
      if (this.type === 'favorite') {
        this.products = this.storageService.getCookieObject('favorite');
      } else if (this.type === 'cart') {
        this.products = this.storageService.getCookieObject('cart');
      }
    }
  }

  removeFavorite(index: number) {
    this.products.splice(index, 1);
    this.storageService.setCookieObject('favorite', this.products);
  }

  removeCart(index: number) {
    this.products.splice(index, 1);
    this.storageService.setCookieObject('cart', this.products);
  }
}
