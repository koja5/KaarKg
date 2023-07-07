import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { UserType } from '../enums/user-type';
import { FileType } from '../enums/file-type';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  helper = new JwtHelperService();

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private configurationService: ConfigurationService
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

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  public checkMobileDevice() {
    if (window.innerWidth < 992) {
      return true;
    } else {
      return false;
    }
  }

  getLocalStorageStringValue(key: string) {
    return localStorage.getItem(key);
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

  packageNavigations(products: any, subproducts: any) {
    for (let i = 0; i < products.length; i++) {
      let items = [];
      for (let j = 0; j < subproducts.length; j++) {
        if (products[i].id == subproducts[j].navigation_product_id) {
          items.push(subproducts[j]);
        }
      }
      products[i]['subChild'] = items;
    }
    return products;
  }
}
