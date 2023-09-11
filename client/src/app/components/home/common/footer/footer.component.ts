import { Component, Input, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() class: string | undefined;

  public year: number | undefined;
  public language: any;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.language = this.helpService.getLanguage();
    if (this.language.footerText.indexOf('{YEAR}') != -1) {
      this.language.footerText = this.language.footerText.replace(
        '{YEAR}',
        this.year
      );
    }
  }
}
