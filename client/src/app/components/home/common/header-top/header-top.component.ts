import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss']
})
export class HeaderTopComponent implements OnInit {

  public language: any;

  constructor(private helpService: HelpService) { }

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

}
