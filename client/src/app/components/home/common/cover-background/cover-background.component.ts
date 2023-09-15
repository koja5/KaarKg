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
  public position!: string;

  constructor(private helpService: HelpService, private router: Router) {}

  ngOnInit(): void {
    this.text = this.helpService.getCustomText();
    this.checkTextPosition();
  }

  checkTextPosition() {
    switch (this.text.coverBannerTextPosition) {
      case 0:
        this.position = 'left';
        break;
      case 1:
        this.position = 'center';
        break;
      case 2:
        this.position = 'right';
        break;
      default:
        this.position = 'center';
        break;
    }
  }

  goToLink() {
    if (this.text.coverButtonLink) {
      const path = this.text.coverButtonLink.split(window.location.host)[1];
      this.router.navigate([path]);
    }
  }
}
