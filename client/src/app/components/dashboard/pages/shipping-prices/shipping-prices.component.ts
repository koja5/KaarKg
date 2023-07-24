import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping-prices',
  templateUrl: './shipping-prices.component.html',
  styleUrls: ['./shipping-prices.component.scss'],
})
export class ShippingPricesComponent implements OnInit {
  public path = '/grids/superadmin';
  public file = 'shipping-prices.json';

  constructor() {}

  ngOnInit(): void {}
}
