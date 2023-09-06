import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-cover-background',
  templateUrl: './cover-background.component.html',
  styleUrls: ['./cover-background.component.scss'],
})
export class CoverBackgroundComponent implements OnInit {
  public text: any;

  constructor(private helpService: HelpService, private router: Router) {}

  ngOnInit(): void {
    this.text = this.helpService.getCustomText();
  }

  goToLink() {
    if (this.text.coverButtonLink) {
      const path = this.text.coverButtonLink.split(window.location.host)[1];
      this.router.navigate([path]);
    }
  }
}
