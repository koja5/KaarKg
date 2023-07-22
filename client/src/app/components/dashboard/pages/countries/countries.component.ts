import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  public path = '/grids/superadmin';
  public file = 'countries.json';

  constructor() {}

  ngOnInit(): void {}
}
