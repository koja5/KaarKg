import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
})
export class HeaderTopComponent implements OnInit {
  public language: any;
  public text: any;

  constructor(public helpService: HelpService, private router: Router) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.text = this.helpService.getCustomText();
  }

  routerToHome() {
    this.router.navigate(['./']);
  }
}
