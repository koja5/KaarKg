import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-payment-error',
  templateUrl: './payment-error.component.html',
  styleUrls: ['./payment-error.component.scss'],
})
export class PaymentErrorComponent implements OnInit {
  public language: any;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }
}
