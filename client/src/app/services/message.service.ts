import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public refreshGrid = new Subject<null>();
  public refreshFormDataAfterUpdate = new Subject<null>();
  public orientation = new Subject<string>();
  public searchProductValue = new Subject<string>();
  public viewCart = new Subject<null>();
  public refreshCartInformation = new Subject<null>();
  public searchValueForProduct = new Subject<any>();

  constructor() {}

  sendRefreshGrid() {
    this.refreshGrid.next(null);
  }

  getRefreshGrid(): Observable<any> {
    return this.refreshGrid.asObservable();
  }

  sendRefreshFormDataAfterUpdate() {
    this.refreshFormDataAfterUpdate.next(null);
  }

  getRefreshFormDataAfterUpdate(): Observable<any> {
    return this.refreshFormDataAfterUpdate.asObservable();
  }

  sendOrientation(value: string) {
    this.orientation.next(value);
  }

  getOrientation(): Observable<string> {
    return this.orientation.asObservable();
  }

  sentSearchProductValue(value: string) {
    this.searchProductValue.next(value);
  }

  getSearchProductValue(): Observable<string> {
    return this.searchProductValue.asObservable();
  }

  sentViewCart() {
    this.viewCart.next(null);
  }

  getViewCart() {
    return this.viewCart.asObservable();
  }

  sentRefreshCartInformation() {
    this.refreshCartInformation.next(null);
  }

  getRefreshCartInformation() {
    return this.refreshCartInformation.asObservable();
  }

  sentSearchValueForProducts(value: string) {
    this.searchValueForProduct.next(value);
  }

  getSearchValueForProducts() {
    return this.searchValueForProduct.asObservable();
  }
}
