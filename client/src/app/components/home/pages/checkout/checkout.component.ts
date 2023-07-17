import { Component, OnInit } from '@angular/core';
import { ShippingAddress } from '@stripe/stripe-js';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  public language: any;
  public products: any;
  public subtotal = 0;
  public shipping = 0;
  public total = 0;
  public shippingAddress: any;
  public mainAddress: any;

  constructor(
    private helpService: HelpService,
    private storageService: StorageService,
    private service: CallApiService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.products = this.storageService.getCookieObject('cart');
    this.shippingAddress =
      this.storageService.getLocalStorageObject('shipping');
    this.getMainAddress();
    this.getSubtotal();
    this.getTotal();
  }

  getMainAddress() {
    this.service
      .callGetMethod('api/getMyShippingAddress', '')
      .subscribe((data: any) => {
        this.mainAddress = data[0];
      });
  }

  getSubtotal() {
    this.subtotal = 0;
    for (let i = 0; i < this.products.length; i++) {
      this.subtotal += this.products[i].price;
    }
  }

  getTotal() {
    this.total = this.subtotal + this.shipping;
  }

  pay() {
    let data = {
      shippingAddress: this.shippingAddress,
      mainAddress: this.mainAddress,
      language: this.helpService.getLanguage(),
      products: this.products,
      total: this.total,
    };
    this.service
      .callPostMethod('/api/sendInvoiceToCustomer', data)
      .subscribe((data) => {
        console.log(data);
      });

    this.service
      .callPostMethod('/api/sendInvoiceToSuperadmin', data)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
