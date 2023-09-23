import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-no-products-available',
  templateUrl: './no-products-available.component.html',
  styleUrls: ['./no-products-available.component.scss'],
})
export class NoProductsAvailableComponent implements OnInit {
  public language: any;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }
}
