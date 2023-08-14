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
  public accountType: any;
  public loader = false;

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
    this.accountType = this.helpService.getAccountTypeId();
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchProduct'].currentValue) {
      let search = 'searchProducts';
      if (this.helpService.getDecodeToken()) {
        search = 'searchProductsForLoginUser';
      }
      this.service
        .callGetMethod('/api/' + search, changes['searchProduct'].currentValue)
        .subscribe((data) => {
          this.products = data;
          this.category =
            this.language.productResultFor +
            ' ' +
            changes['searchProduct'].currentValue;
        });
    } else {
      this.initialize();
    }
  }

  public onPreventScroll = (event: any): void => {};

  initialize() {
    this.loader = true;
    this.category = this.route.snapshot.paramMap.get('category')!;
    if (!this.language) {
      this.language = this.helpService.getLanguageAndCheckFile();
    }
    if (this.storageService.getToken()) {
      if (this.category === this.language.navigationNew) {
        this.service
          .callGetMethod('/api/getAllNewProductsForLoginUser/', '')
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      } else if (this.category === this.language.navigationActions) {
        this.service
          .callGetMethod('/api/getAllActionsProductsForLoginUser/', '')
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      } else if (this.category === this.language.navigationAllProducts) {
        this.service
          .callGetMethod('/api/getAllProductsForLoginUser/', '')
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      } else {
        this.service
          .callGetMethod(
            '/api/getAllProductsForCategoryForLoginUser/',
            this.category!
          )
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      }
    } else {
      if (this.category === this.language.navigationNew) {
        this.service
          .callGetMethod('/api/getAllNewProducts/', '')
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      } else if (this.category === this.language.navigationActions) {
        this.service
          .callGetMethod('/api/getAllActionsProducts/', '')
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      } else if (this.category === this.language.navigationAllProducts) {
        this.service
          .callGetMethod('/api/getAllProducts/', '')
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      } else {
        this.service
          .callGetMethod('/api/getAllProductsForCategory', this.category!)
          .subscribe((products) => {
            this.products = products;
            this.loader = false;
          });
      }
    }
  }

  quickViewItem(item: any) {
    this.item = item;
    this.item.quantity = 1;
    this.quickView.show();
  }

  addToFavorite(item: any) {
    this.helpService.addToFavorite(item);
  }

  addToCart(item: any) {
    item.quantity = 1;
    this.helpService.addToCart(item);
  }

  getNoImageAvailablePicture(index: number) {
    this.products[index].image = '../no-image-available.png';
  }

  hideProductItemDialog() {
    this.quickView.hide();
  }
}
