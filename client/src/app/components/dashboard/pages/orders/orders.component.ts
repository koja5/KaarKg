import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public path = '/grids/superadmin';
  public file = 'orders.json';

  constructor() {}

  ngOnInit(): void {}
}
