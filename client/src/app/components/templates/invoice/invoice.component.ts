import { Component, Input, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  @Input() data: any;
  public language: any;
  public sum: any;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  getSum() {
    return (this.data.number_of_weeks * this.data.price).toFixed(2);
  }
}
