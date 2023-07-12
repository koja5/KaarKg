import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @Input() searchProduct!: string;
  @ViewChild('quickView')
  public quickView!: DialogComponent;
  public products: any;
  public category!: string;
  public item: any;
  public language: any;

  constructor(
    private service: CallApiService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private helpService: HelpService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.initialize();
      }
    });
  }

  ngOnInit(): void {
    this.language = this.helpService.getLanguageAndCheckFile();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchProduct'].currentValue) {
      this.service
        .callGetMethod(
          '/api/searchProducts',
          changes['searchProduct'].currentValue
        )
        .subscribe((data) => {
          this.products = data;
          this.category = 'Result for ' + changes['searchProduct'].currentValue;
        });
    } else {
      this.initialize();
    }
  }

  public onPreventScroll = (event: any): void => {
    this.quickView.cssClass = 'e-fixed';
  };

  initialize() {
    this.category = this.route.snapshot.paramMap.get('category')!;
    if (this.category) {
      this.service
        .callGetMethod('/api/getAllProductsForCategory', this.category!)
        .subscribe((products) => {
          this.products = products;
        });
    } else {
      console.log('Akcije!');
    }
  }

  quickViewItem(item: any) {
    this.item = item;
    this.quickView.cssClass = 'e-fixed';
    this.quickView.show();
  }

  addToFavorite(item: any) {
    let currentFavorite = this.storageService.getCookieObject('favorite');
    let ind = 1;
    if (currentFavorite != '') {
      for (let i = 0; i < currentFavorite['length']; i++) {
        if (currentFavorite[i]['title'] === item.title) {
          (currentFavorite as []).splice(i, 1);
          ind = 0;
        }
      }
    }
    if (ind) {
      if (currentFavorite === '') {
        currentFavorite = [];
      }
      currentFavorite.push(item);
      this.storageService.setCookie(
        'favorite',
        JSON.stringify(currentFavorite)
      );
    }
  }

  addToCart(item: any) {
    let currentFavorite = this.storageService.getCookieObject('cart');
    let ind = 1;
    if (currentFavorite.length > 0) {
      for (let i = 0; i < currentFavorite['length']; i++) {
        if (currentFavorite[i]['title'] === item.title) {
          (currentFavorite as []).splice(i, 1);
          ind = 0;
        }
      }
    }
    if (ind) {
      currentFavorite.push(item);
      this.storageService.setCookie('cart', JSON.stringify(currentFavorite));
    }
  }

  getNoImageAvailablePicture(index: number) {
    this.products[index].image = '../no-image-available.png';
  }
}
