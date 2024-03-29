import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Subscription } from 'rxjs';
import { LoginFormType } from 'src/app/enums/login-form-type';
import { UserType } from 'src/app/enums/user-type';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('loginDialog')
  public loginDialog!: DialogComponent;
  public items: ItemModel[] = [];
  public username!: any;
  public type!: any;
  public rightCard: string = '';
  public mobileNavigation: string = '';
  public searchProduct!: string;
  public cookieMessage = '';
  public language: any;
  public text: any;
  public loginFormTitle!: string;
  public listFavorites: any;
  public numberOfProductInChart = 0;
  public subOfProductInCart = 0;
  public searchInput = '';
  public loginDialogShow = false;
  public mobileHeader = '';

  //subscription
  private subscribeViewCart!: Subscription;
  private subscribeRefreshCartInformation!: Subscription;

  constructor(
    private router: Router,
    private helpService: HelpService,
    private storageService: StorageService,
    private configurationService: ConfigurationService,
    private messageService: MessageService,
    private service: CallApiService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.initalizeConfigData();
    this.checkCart();
    this.checkMessageService();
  }

  ngOnDestroy() {
    this.subscribeViewCart.unsubscribe();
    this.subscribeRefreshCartInformation.unsubscribe();
  }

  ngAfterViewInit(): void {
    document.onclick = (args: any): void => {
      if (
        args.target.className.indexOf('cart-overlay') !== -1 ||
        args.target.className.indexOf('e-dlg-overlay') !== -1
      ) {
        this.messageService.sentHideDialog();
        this.closeLoginDialog();
        this.closeCard();
        this.searchInput = '';
      }
    };
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (event.srcElement.scrollingElement.scrollTop > 10) {
      this.mobileHeader = 'mobile-header';
    } else {
      this.mobileHeader = '';
    }
  }

  checkMessageService() {
    this.subscribeViewCart = this.messageService
      .getViewCart()
      .subscribe((message) => {
        this.showCart();
      });

    this.subscribeRefreshCartInformation = this.messageService
      .getRefreshCartInformation()
      .subscribe((message) => {
        this.checkCart();
      });
  }

  login() {
    this.router.navigate(['/dashboard']);
  }

  initalizeConfigData() {
    this.configurationService.getLanguage().subscribe((data) => {
      this.language = data;
      this.helpService.setLanguage(data);
      this.loginFormTitle = this.language.loginTitleLogin;
      this.setDashboardProfile();
    });

    this.configurationService.getCustomText().subscribe((data) => {
      this.text = data;
      this.helpService.setCustomText(data);
    });

    this.cookieMessage = this.storageService.getCookie('cookie');
  }

  closeLoginDialog() {
    this.loginDialog.hide();
    this.loginFormTitle = this.language.loginTitleLogin;
    this.getUserInfo();
  }

  checkCart() {
    const products = this.helpService.getLocalStorage('cart');
    this.subOfProductInCart = 0;
    this.numberOfProductInChart = products.length;
    for (let i = 0; i < products.length; i++) {
      this.subOfProductInCart +=
        products[i].price * (products[i].quantity ? products[i].quantity : 1);
    }
  }

  setDashboardProfile() {
    if (this.type === 0) {
      this.items = [
        {
          text: this.language.homeMyDashboard,
          id: 'dashboard',
        },
        {
          text: this.language.homeMyProfile,
          id: 'settings',
        },
        {
          text: this.language.homeLogout,
          id: 'logout',
        },
      ];
    } else {
      this.items = [
        {
          text: this.language.homeMyProfile,
          id: 'settings',
        },
        {
          text: this.language.homeLogout,
          id: 'logout',
        },
      ];
    }
  }

  getUserInfo() {
    const token = this.helpService.getDecodeToken();
    if (token) {
      this.username = token.firstname ? token.firstname : token.lastname;
      this.type = token.type;
    }
  }

  profileIconSelectEvent(event: MenuEventArgs) {
    switch (event.item.id) {
      case 'dashboard':
        this.router.navigate(['dashboard']);
        break;
      case 'settings':
        this.router.navigate(['settings']);
        break;
      case 'logout':
        this.logout();
        break;
      default:
        break;
    }
  }

  logout() {
    this.storageService.deleteToken();
    this.username = null;
    this.type = null;
    this.checkRealProductPriceForCart();
  }

  onSearchChange(event: any) {
    if (window.location.pathname.indexOf('category') === -1) {
      this.router.navigate(['/']);
      this.searchProduct = event.target.value;
      this.messageService.sentSearchValueForProducts(event.target.value);
    } else if (event.target.value.length > 2 || event.target.value === '') {
      this.searchProduct = event.target.value;
      this.messageService.sentSearchValueForProducts(event.target.value);
    }
  }

  cookieEmitter() {
    this.cookieMessage = 'true';
  }

  changeLoginFormType(event: any) {
    switch (event) {
      case LoginFormType.login:
        this.loginFormTitle = this.language.loginTitleLogin;
        break;
      case LoginFormType.signup:
        this.loginFormTitle = this.language.loginTitleSignUp;
        break;
      case LoginFormType.forgot:
        this.loginFormTitle = this.language.loginTitleForgotPassword;
    }
  }

  showFavorite() {
    this.rightCard === '' ? (this.rightCard = 'opened') : (this.rightCard = '');
    this.type = 'favorite';
  }

  showCart() {
    this.rightCard === '' ? (this.rightCard = 'opened') : (this.rightCard = '');
    this.type = 'cart';
  }

  needToLoginEmitter() {
    this.helpService.setSessionStorage('previous', 'checkout');
    this.loginFormTitle = this.language.loginTitleLogin;
    this.loginDialogShow = true;
    this.loginDialog.show();
  }

  closeCard() {
    this.rightCard = '';
  }

  openLoginDialog() {
    this.loginDialogShow = true;
    this.loginDialog.show();
  }

  hideLoginDialog() {
    this.loginDialogShow = false;
    this.loginDialog.hide();
    this.loginFormTitle = this.language.loginTitleLogin;
  }

  closeNavigation() {
    this.mobileNavigation = '';
  }

  showQuickView(event: any) {
    this.closeCard();
    if (this.helpService.getAccountTypeId() != -1) {
      this.service
        .callGetMethod('/api/getProductByIdForLoginUser', event.id)
        .subscribe((data: any) => {
          if (data) {
            this.messageService.sentShowQuickView(data[0]);
          }
        });
    } else {
      this.service
        .callGetMethod('/api/getProductById', event.id)
        .subscribe((data: any) => {
          if (data) {
            this.messageService.sentShowQuickView(data[0]);
          }
        });
    }
  }

  setRequiredFields(event: any, data: any) {
    event['description'] = data['description'];
    event['title'];
  }

  public checkRealProductPriceForCart() {
    const products = this.helpService.getLocalStorage('cart');
    if (products.length) {
      if (this.helpService.getAccountTypeId() != -1) {
        this.service
          .callPostMethod('/api/getProductPriceForLoginUser', products)
          .subscribe((data) => {
            this.setRealPrice(data, products);
            this.helpService.setLocalStorage('cart', products);
            this.messageService.sentRefreshCartInformation();
            window.location.href = '/';
          });
      } else {
        this.service
          .callPostMethod('/api/getProductPrice', products)
          .subscribe((data) => {
            this.setRealPrice(data, products);
            this.helpService.setLocalStorage('cart', products);
            this.messageService.sentRefreshCartInformation();
            window.location.href = '/';
          });
      }
    } else {
      window.location.href = '/';
    }
  }

  setRealPrice(data: any, products: any) {
    let i = 0;
    while (i < data.length) {
      for (let j = 0; j < products.length; j++) {
        if (data[i].id == products[j].id) {
          products[j].price = data[i].price;
          data.splice(i, 1);
          i = 0;
          break;
        }
      }
    }
  }
}
