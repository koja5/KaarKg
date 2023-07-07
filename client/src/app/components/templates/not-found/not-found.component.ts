import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  public language: any;

  constructor(private helpService: HelpService) { }

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

}
