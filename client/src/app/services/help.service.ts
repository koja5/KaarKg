import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { UserType } from '../enums/user-type';
import { FileType } from '../enums/file-type';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { ToastrComponent } from '../components/common/toastr/toastr.component';
import { MessageService } from './message.service';
import { CallApiService } from './call-api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  helper = new JwtHelperService();

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private toastr: ToastrComponent,
    private messageService: MessageService,
    private router: Router
  ) {}

  getDecodeToken() {
    if (this.storageService.getToken()) {
      return this.helper.decodeToken(this.storageService.getToken()).user;
    }
    return false;
  }

  getTypeOfName(type: any) {
    for (var item in UserType) {
      if (Number(item) === type) {
        return UserType[item];
      }
    }
    return UserType[UserType.customer];
  }

  getAccountTypeId() {
    if (this.storageService.getToken()) {
      const user = this.helper.decodeToken(this.storageService.getToken());
      return user.user.type;
    }
    return -1;
  }

  checkRights(rights: any) {
    const type = this.getTypeOfName(this.getDecodeToken().type);
    if (rights) {
      for (let i = 0; i < rights.length; i++) {
        if (rights[i] === type) {
          return true;
        }
      }
      return false;
    } else return true;
  }

  public checkMobileDevice() {
    if (window.innerWidth < 992) {
      return true;
    } else {
      return false;
    }
  }

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  getLocalStorageStringValue(key: string) {
    return localStorage.getItem(key);
  }

  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  setSessionStorage(key: string, value: any) {
    sessionStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  removeSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  getSessionStorageStringValue(key: string) {
    return sessionStorage.getItem(key);
  }

  getUserType() {
    const token = this.getDecodeToken();
    return token.type;
  }

  getHeightForGridWithoutPx(partOfTab?: boolean) {
    let innerHeight = window.innerHeight;
    if (partOfTab) {
      innerHeight = Number(innerHeight - 309);
    } else {
      innerHeight = Number(innerHeight - 273);
    }

    if (this.getLocalStorageStringValue('orientation') === 'horizontal') {
      if (window.innerWidth > 992) {
        innerHeight = innerHeight - 60;
      } else {
        innerHeight = innerHeight - 20;
      }
    }
    return innerHeight;
  }

  setLanguage(value: any) {
    localStorage.setItem(
      'language',
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  getLanguageAndCheckFile() {
    if (localStorage.getItem('language')) {
      return JSON.parse(localStorage.getItem('language') ?? '{}');
    } else {
      this.configurationService.getLanguage().subscribe((data) => {
        this.setLanguage(data);
        return data;
      });
    }
  }

  getLanguage() {
    if (localStorage.getItem('language')) {
      return JSON.parse(localStorage.getItem('language') ?? '{}');
    } else {
      return null;
    }
  }

  setCustomText(value: any) {
    localStorage.setItem(
      'custom-text',
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  getCustomText() {
    if (localStorage.getItem('custom-text')) {
      return JSON.parse(localStorage.getItem('custom-text') ?? '{}');
    } else {
      return null;
    }
  }

  postRequestDataParameters(body: any, data: any, parameters: string[]) {
    for (let i = 0; i < parameters.length; i++) {
      body[parameters[i]] = data[parameters[i]];
    }
    return body;
  }

  getRequestDataParameters(data: any, parameters: string[]) {
    let value = '';
    if (parameters) {
      for (let i = 0; i < parameters.length; i++) {
        value += data[parameters[i]] + '/';
      }
    }
    return value;
  }

  concatenatePageLink(link: string, parameters: string[], data: any) {
    let parametersValue = '';
    for (let i = 0; i < parameters.length; i++) {
      parametersValue += data[parameters[i]] + '/';
    }
    if (link.endsWith('/')) {
      return link + parametersValue;
    } else {
      return link + '/' + parametersValue;
    }
  }

  getFileTypeIcon(type: string) {
    switch (type) {
      case FileType.pdf:
        return 'picture_as_pdf';
      default:
        return 'description';
    }
  }

  getLanguageFromFolder(language: string, file: string) {
    return this.http.get(
      '../assets/configurations/languages/pages/' +
        language +
        '/' +
        file +
        '.json'
    );
  }

  packageNavigations(products: any) {
    let array = [];
    let subproducts = this.copyObject(products);
    for (let i = 0; i < products.length; i++) {
      let items = [];
      let indexForSplice = [];
      for (let j = 0; j < subproducts.length; j++) {
        if (
          products[i].id == subproducts[j].category_id &&
          subproducts[j].id != subproducts[j].category_id
        ) {
          items.push(subproducts[j]);
          indexForSplice.push(j);
          // subproducts.splice(j, 1);
        }
      }
      // subproducts = this.spliceArraies(subproducts, indexForSplice);
      if (products[i].id == products[i].category_id) {
        products[i]['subChild'] = items;
        array.push({
          id: products[i].id,
          name: products[i].name,
          subChild: items,
        });
      }
    }
    return array;
  }

  spliceArraies(array: any, indexes: any) {
    for (let i = 0; i < indexes.length; i++) {
      array.splice(indexes[i], 1);
    }
    return array;
  }

  copyObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  addToFavorite(article: any) {
    let item = this.copyObject(article);
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
      item = this.removeUnnecessaryProperty(item);
      currentFavorite.push(item);
      this.storageService.setCookie(
        'favorite',
        JSON.stringify(currentFavorite)
      );
    }

    const language = this.getLanguage();

    this.toastr.showSuccessCustom(
      '',
      language.productSuccessfulyAddNewArticleInFavorite
    );
  }

  addNewQuantityToCart(item: any, quantity: number) {
    let current = this.storageService.getCookieObject('cart');
    for (let i = 0; i < current['length']; i++) {
      if (current[i]['title'] === item.title) {
        current[i].quantity = quantity;
        break;
      }
    }
    this.storageService.setCookieObject('cart', current);
    this.messageService.sentRefreshCartInformation();
    // this.messageService.sentRefreshForAdditionaPaymentPrice();
  }

  addToCart(article: any) {
    let item = this.copyObject(article);
    let currentFavorite = this.storageService.getCookieObject('cart');
    let ind = 1;
    if (currentFavorite.length > 0) {
      for (let i = 0; i < currentFavorite['length']; i++) {
        if (currentFavorite[i]['title'] === item.title) {
          /*(currentFavorite as []).splice(i, 1);*/
          currentFavorite[i].quantity++;
          ind = 0;
          break;
        }
      }
    }
    if (ind) {
      if (item.discount_price && item.discount_price > 0) {
        item.price = item.discount_price;
      }
      item = this.removeUnnecessaryProperty(item);
      currentFavorite.push(item);
      this.storageService.setCookie('cart', JSON.stringify(currentFavorite));
    } else {
      this.storageService.setCookie('cart', JSON.stringify(currentFavorite));
    }

    const language = this.getLanguage();

    this.toastr.showSuccessCustom(
      '',
      language.productSuccessfulyAddNewArticleInCart
    );
    this.messageService.sentRefreshCartInformation();
  }

  removeUnnecessaryProperty(item: any) {
    delete item.description;
    delete item.title_short;
    delete item.name;
    delete item.available;
    delete item.persantage;
    delete item.new;
    delete item.discount_price;
    delete item.price_neto
    delete item.category_id;
    item.price = Number(item.price).toFixed(2);
    return item;
  }

  getCurrentDatetime() {
    const date = new Date();
    return `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}. ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  getUserTypeModel() {
    return UserType;
  }

  // checkRealProductPriceForCart() {
  //   const products = this.storageService.getCookieObject('cart');
  //   if (products.length) {
  //     if (this.getAccountTypeId() != false) {
  //       this.service
  //         .callPostMethod('/api/getProductPriceForLoginUser', products)
  //         .subscribe((data) => {
  //           this.setRealPrice(data, products);
  //           this.storageService.setCookieObject('cart', products);
  //           this.messageService.sentRefreshCartInformation();
  //         });
  //     } else {
  //       this.service
  //         .callPostMethod('/api/getProductPrice', products)
  //         .subscribe((data) => {
  //           this.setRealPrice(data, products);
  //           this.storageService.setCookieObject('cart', products);
  //           this.messageService.sentRefreshCartInformation();
  //         });
  //     }
  //   }
  // }

  // setRealPrice(data: any, products: any) {
  //   let i = 0;
  //   while (i < data.length) {
  //     for (let j = 0; j < products.length; j++) {
  //       if (data[i].id == products[j].id) {
  //         products[j].price = data[i].price;
  //         data.splice(i, 1);
  //         i = 0;
  //         break;
  //       }
  //     }
  //   }
  // }

  openLink(link: string) {
    const contains = link.indexOf(window.location.origin);
    if (contains != -1) {
      if (link) {
        const path = link.split(window.location.host)[1];
        this.router.navigate([path]);
      }
    } else {
      window.open(link);
    }
  }
}
