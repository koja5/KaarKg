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

  constructor(private helpService: HelpService, private router: Router) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  routerToHome() {
    this.router.navigate(['./']);
  }

  routerToAboutUs() {
    this.router.navigate(['ueber-uns']);
  }

  routerToHelp() {
    // this.router.navigate(['hilfe']);
    window.open('https://kaarkg.odoo.com/faq');
  }
}
