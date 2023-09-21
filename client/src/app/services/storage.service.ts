import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private cookieService: CookieService) {}

  setSessionStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionStorageSimple(key: string) {
    return sessionStorage.getItem(key);
  }

  getSessionStorageObject(key: string) {
    return JSON.parse(JSON.stringify(sessionStorage.getItem(key)));
  }

  removeAllSessionStorage() {
    sessionStorage.clear();
  }

  removeSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageSimple(key: string) {
    return localStorage.getItem(key);
  }

  getLocalStorageObject(key: string) {
    return JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem(key))));
  }

  removeAllLocalStorage() {
    localStorage.clear();
  }

  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  setToken(token: any) {
    this.cookieService.set('token', token, {
      expires: 1,
      path: '/',
      sameSite: 'Lax',
    });
  }

  getToken() {
    return this.cookieService.get('token');
  }

  deleteToken() {
    this.cookieService.delete('token', '/');
  }

  setCookie(key: string, value: any) {
    this.cookieService.set(key, value, {
      expires: undefined,
      path: '/',
      sameSite: 'Lax',
    });
  }

  getCookie(key: string) {
    return this.cookieService.get(key);
  }

  removeCookie(key: string) {
    this.cookieService.delete(key, '/');
  }

  setCookieObject(key: string, value: any) {
    this.cookieService.set(key, JSON.stringify(value), {
      expires: undefined,
      path: '/',
      sameSite: 'Lax',
    });
  }

  getCookieObject(key: string) {
    if (this.cookieService.get(key)) {
      return JSON.parse(this.cookieService.get(key));
    } else {
      return [];
    }
  }
}
