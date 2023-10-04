import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
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
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, firstValueFrom, isObservable, of, tap } from 'rxjs';

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
    private storageService: StorageService,
    private helpService: HelpService,
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    // this.initialize();
    this.router.events.forEach(async (event: any) => {
      if (event.routerEvent) {
        this.initialize();
        // this.http
        //   .get<any>('http://localhost:4200/api/getAllNewProducts/')
        //   .subscribe((data: any) => {
        //     this.products = data;
        //     this.loader = false;
        //   });
      }
    });
  }

  ngOnInit(): void {
    this.http
      .get<any>('http://localhost:3001/api/getAllNewProducts/')
      .subscribe((data: any) => {
        this.products = data;
        this.loader = false;
      });
    this.language = this.helpService.getLanguageAndCheckFile();
    // this.http
    //   .get<any>('http://localhost:4200/api/getAllNewProducts/')
    //   .subscribe((data: any) => {
    //     this.products = data;
    //     this.loader = false;
    //   });
    // this.accountType = this.helpService.getAccountTypeId();
    // this.initialize();
    // this.messageService.getSearchValueForProducts().subscribe((message) => {
    //   if (message != '') {
    //     this.loader = true;
    //     this.service
    //       .callGetMethod('/api/searchProducts', message)
    //       .subscribe((data) => {
    //         this.products = data;
    //         this.loader = false;
    //         this.category = this.language.productResultFor + ' ' + message;
    //       });
    //   } else {
    //     this.initialize();
    //   }
    // });
  }

  ngAfterViewInit(): void {
    // document.onclick = (args: any): void => {
    //   if (args.target.className === 'e-dlg-overlay') {
    //     this.quickView!.hide();
    //   }
    // };
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['searchProduct'].currentValue) {
    //   let search = 'searchProducts';
    //   if (this.helpService.getDecodeToken()) {
    //     search = 'searchProductsForLoginUser';
    //   }
    //   this.service
    //     .callGetMethod('/api/' + search, changes['searchProduct'].currentValue)
    //     .subscribe((data) => {
    //       this.products = data;
    //       this.category =
    //         this.language.productResultFor +
    //         ' ' +
    //         changes['searchProduct'].currentValue;
    //     });
    // } else {
    //   this.initialize();
    // }
  }

  public onPreventScroll = (event: any): void => {};

  async initialize() {
    // this.http
    //   .get<any>('http://localhost:4200/api/getAllNewProducts/')
    //   .subscribe((data: any) => {
    //     this.products = data;
    //     this.loader = false;
    //   });
    this.loader = true;
    this.category = this.route.snapshot.paramMap.get('category')!;
    // if (!this.language) {
    //   this.language = this.helpService.getLanguageAndCheckFile();
    // }
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
      } else if (this.category.includes(this.language.routerAll)) {
        this.service
          .callGetMethod(
            'api/getAllProductsForMainCategoryForLoginUser',
            this.category.split('-' + this.language.routerAll)[0]
          )
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
      const p = this.http.get<any>(
        'http://localhost:4200/api/getAllNewProducts/'
      );
      // await this.getOrganizations();
      // if (isPlatformBrowser(this.platformId)) {
      //   this.http
      //     .get<any>('http://localhost:4200/api/getAllNewProducts/')
      //     .subscribe((data: any) => {
      //       if (isPlatformServer(this.platformId)) {
      //         this.products = data;
      //         this.loader = false;
      //       }
      //     });
      // }
      // if (this.category === this.language.navigationNew) {
      //   this.service
      //     .callGetMethod('/api/getAllNewProducts/', '')
      //     .subscribe((products) => {
      //       this.products = products;
      //       this.loader = false;
      //     });
      // } else if (this.category === this.language.navigationActions) {
      //   this.service
      //     .callGetMethod('/api/getAllActionsProducts/', '')
      //     .subscribe((products) => {
      //       this.products = products;
      //       this.loader = false;
      //     });
      // } else if (this.category === this.language.navigationAllProducts) {
      //   this.service
      //     .callGetMethod('/api/getAllProducts/', '')
      //     .subscribe((products) => {
      //       this.products = products;
      //       this.loader = false;
      //     });
      // } else if (this.category.includes(this.language.routerAll)) {
      //   this.service
      //     .callGetMethod(
      //       'api/getAllProductsForMainCategory',
      //       this.category.split('-' + this.language.routerAll)[0]
      //     )
      //     .subscribe((products) => {
      //       this.products = products;
      //       this.loader = false;
      //     });
      // } else {
      //   this.http
      //     .get('https://api.publicapis.org/entries')
      //     .subscribe((data) => {
      //       this.products = data;
      //     });
      // }
    }
  }

  async getOrganizations() {
    this.products = await this.http
      .get<any>('http://localhost:4200/api/getAllNewProducts/')
      .toPromise();
    // this.organizationList = await this.organizationService
    //   .getOrganizations()
    //   .toPromise();
    // this.organizationList.sort((a, b) =>
    //   a.orginizationId < b.orginizationId ? 1 : -1
    // );
  }

  platformId(platformId: any) {
    throw new Error('Method not implemented.');
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
