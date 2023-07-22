import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public language: any;
  public currentLink: string | undefined;

  constructor(private helpService: HelpService, private router: Router) {}

  ngOnInit(): void {
    this.currentLink = window.location.pathname;
    this.language = this.helpService.getLanguage();
  }

  clickToTab(link: string) {
    this.currentLink = link;
    this.router.navigate([link]);
  }
}
