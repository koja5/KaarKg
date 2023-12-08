import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  public data: any;
  public language: any;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.data = JSON.parse(this.helpService.getSessionStorage('order'));
    this.language = this.helpService.getLanguage();
  }

  printOrder() {
    if (document.getElementById('invoice')) {
      var printContents = document.getElementById('invoice')!.innerHTML;
      var originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.close();
    }
  }
}
