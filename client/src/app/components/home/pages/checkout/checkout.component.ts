import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public subtotalNeto = 0;
  public subtotalBruto = 0;
  public shipping = 10;
  public total: string | undefined;
  public vat = '20%';
  public shippingAddress: any;
  public mainAddress: any;
  public type: any;

  constructor(
    private helpService: HelpService,
    private storageService: StorageService,
    private service: CallApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    // this.products = this.storageService.getCookieObject('cart');
    this.type = this.helpService.getAccountTypeId();
    this.calculateProducts();
    this.shippingAddress =
      this.storageService.getLocalStorageObject('shipping');
    this.getMainAddress();
  }

  getMainAddress() {
    this.service
      .callGetMethod('api/getMyShippingAddress', '')
      .subscribe((data: any) => {
        this.mainAddress = data[0];
      });
  }

  calculateProducts() {
    const products = this.storageService.getCookieObject('cart');

    if (this.type === 3) {
      for (let i = 0; i < products.length; i++) {
        products[i].neto = products[i].price;
        products[i].bruto = Number(products[i].price * 1.2).toFixed(2);
        products[i].vat = '20%';
      }
    } else {
      for (let i = 0; i < products.length; i++) {
        products[i].bruto = products[i].price;
        products[i].neto = Number(products[i].price / 1.2).toFixed(2);
        products[i].vat = '20%';
      }
    }
    this.products = products;
    this.getSubtotal();
    this.getTotal();
  }

  getSubtotal() {
    this.subtotalNeto = 0;
    this.subtotalBruto = 0;
    for (let i = 0; i < this.products.length; i++) {
      this.subtotalNeto += Number(this.products[i].neto);
      this.subtotalBruto += Number(this.products[i].bruto);
    }
  }

  getTotal() {
    this.total = Number(this.subtotalBruto + this.shipping).toFixed(2);
  }

  pay() {
    let data = {
      shippingAddress: this.shippingAddress,
      mainAddress: this.mainAddress,
      language: this.helpService.getLanguage(),
      products: this.products,
      subtotalNeto: this.subtotalNeto,
      total: this.total,
      vat: this.vat,
      shipping: this.shipping,
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
        if(data) {
          this.router.navigate(['payment-success/prepayment']);
        }
      });
  }
}
