import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { LoginFormType } from 'src/app/enums/login-form-type';
import { UserType } from 'src/app/enums/user-type';
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
  public loginFormTitle!: string;
  public listFavorites: any;
  public numberOfProductInChart = 0;
  public subOfProductInCart = 0;
  public searchInput = '';
  public loginDialogShow = false;

  constructor(
    private router: Router,
    private helpService: HelpService,
    private storageService: StorageService,
    private configurationService: ConfigurationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.initalizeConfigData();
    this.checkCart();
    this.checkMessageService();
  }

  checkMessageService() {
    this.messageService.getViewCart().subscribe((message) => {
      this.showCart();
    });

    this.messageService.getRefreshCartInformation().subscribe((message) => {
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
    this.cookieMessage = this.storageService.getCookie('cookie');
  }

  closeLoginDialog() {
    this.loginDialog.hide();
    this.getUserInfo();
  }

  checkCart() {
    const products = this.storageService.getCookieObject('cart');
    this.subOfProductInCart = 0;
    this.numberOfProductInChart = products.length;
    for (let i = 0; i < products.length; i++) {
      this.subOfProductInCart += products[i].price * products[i].quantity;
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
    window.location.reload();
  }

  onSearchChange(event: any) {
    if (event.target.value.length > 2 || event.target.value === '') {
      this.searchProduct = event.target.value;
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
  }
}
