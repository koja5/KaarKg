import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent implements OnInit {
  @Input() title!: string;
  @Input() icon!: string;
  public language: any;

  constructor(private helpService: HelpService, private router: Router) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  goBack() {
    this.router.navigate(['../']);
  }
}
