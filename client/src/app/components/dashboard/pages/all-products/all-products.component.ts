import { Component, HostListener, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnInit {
  public path = '/grids/superadmin';
  public file = 'all-products.json';

  public height: number | undefined;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.height = this.helpService.getHeightForGridWithoutPx(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.height = this.helpService.getHeightForGridWithoutPx(false);
  }
}
