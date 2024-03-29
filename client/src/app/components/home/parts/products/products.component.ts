import {
  Component,
  ElementRef,
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
import { EmitType } from '@syncfusion/ej2-base';
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { error } from 'console';

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

  //subscription
  public subscribeShowQuickView!: Subscription;
  public subscribeSearchValueForProducts!: Subscription;
  public subscribeHideDialog!: Subscription;

  constructor(
    private service: CallApiService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private helpService: HelpService,
    private messageService: MessageService,
    private router: Router
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

    this.subscribeSearchValueForProducts = this.messageService.getSearchValueForProducts().subscribe((message) => {
      if (message != '') {
        this.loader = true;
        let search = 'searchProducts';
        if (this.helpService.getDecodeToken()) {
          search = 'searchProductsForLoginUser';
        }
        this.service
          .callGetMethod('/api/' + search, message)
          .subscribe((data) => {
            this.products = data;
            this.loader = false;
            this.category = this.language.productResultFor + ' ' + message;
          });
      } else {
        this.initialize();
      }
    });

    this.subscribeShowQuickView = this.messageService
      .getShowQuickView()
      .subscribe((message) => {
        this.quickViewItem(message);
      });

    this.subscribeHideDialog = this.messageService
      .getHideDialog()
      .subscribe(() => {
        this.hideProductItemDialog();
      });
  }

  ngOnDestroy(): void {
    this.subscribeShowQuickView.unsubscribe();
    this.subscribeSearchValueForProducts.unsubscribe();
    this.subscribeHideDialog.unsubscribe();
  }

  // ngAfterViewInit(): void {
  //   document.onclick = (args: any): void => {
  //     if (args.target.className === 'e-dlg-overlay') {
  //       this.quickView!.hide();
  //     }
  //   };
  // }

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
          .subscribe(
            (products) => {
              this.products = products;
              this.loader = false;
            },
            (error) => {
              this.callApiToGetProducts('getAllNewProducts', '');
            }
          );
      } else if (this.category === this.language.navigationActions) {
        this.service
          .callGetMethod('/api/getAllActionsProductsForLoginUser/', '')
          .subscribe(
            (products) => {
              this.products = products;
              this.loader = false;
            },
            (error) => {
              this.callApiToGetProducts('getAllActionsProducts', '');
            }
          );
      } else if (this.category === this.language.navigationAllProducts) {
        this.service
          .callGetMethod('/api/getAllProductsForLoginUser/', '')
          .subscribe(
            (products) => {
              this.products = products;
              this.loader = false;
            },
            (error) => {
              this.callApiToGetProducts('getAllProducts', '');
            }
          );
      } else if (this.category.includes(this.language.routerAll)) {
        this.service
          .callGetMethod(
            'api/getAllProductsForMainCategoryForLoginUser',
            this.category.split('-' + this.language.routerAll)[0]
          )
          .subscribe(
            (products) => {
              this.products = products;
              this.loader = false;
            },
            (error) => {
              this.callApiToGetProducts(
                'getAllProductsForMainCategory',
                this.category.split('-' + this.language.routerAll)[0]
              );
            }
          );
      } else {
        this.service
          .callGetMethod(
            '/api/getAllProductsForCategoryForLoginUser/',
            this.category!
          )
          .subscribe(
            (products) => {
              this.products = products;
              this.loader = false;
            },
            (error) => {
              this.callApiToGetProducts(
                'getAllProductsForCategory',
                this.category!
              );
            }
          );
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
        this.callApiToGetProducts('getAllActionsProducts', '');
      } else if (this.category === this.language.navigationAllProducts) {
        this.callApiToGetProducts('getAllProducts', '');
      } else if (this.category.includes(this.language.routerAll)) {
        this.callApiToGetProducts(
          'getAllProductsForMainCategory',
          this.category.split('-' + this.language.routerAll)[0]
        );
      } else {
        this.callApiToGetProducts('getAllProductsForCategory', this.category!);
      }
    }
  }

  callApiToGetProducts(method: string, params: string) {
    this.service
      .callGetMethod('/api/' + method, params)
      .subscribe((products) => {
        this.products = products;
        this.loader = false;
      });
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
    this.products[index].image = '../no-image.png';
  }

  hideProductItemDialog() {
    this.quickView.hide();
  }

  getProductsForMainCategory(id: string) {
    this.service
      .callGetMethod('api/getAllProductsForMainCategory', id)
      .subscribe((products) => {
        this.products = products;
        this.loader = false;
        this.helpService.removeSessionStorage('mainCategoryId');
      });
  }
}
