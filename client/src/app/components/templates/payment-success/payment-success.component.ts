import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit {
  public sessionId: string | undefined;
  public language: any;

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.sessionId = this.route.snapshot.paramMap.get('sessionId')!;
  }
}
