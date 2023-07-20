import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  public allQuestions: any;
  public title: string | undefined;
  public allConfig: any;
  public language: any;
  public search = '';

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.helpService
      .getLanguageFromFolder('germany', 'faq')
      .subscribe((data: any) => {
        this.title = data.title;
        this.allQuestions = data.items;
        this.allConfig = JSON.parse(JSON.stringify(data));
      });
  }

  searchFAQ() {
    // this.config = this.config.findIndex((obj: any) => obj.question === this.search)
    const allQuestion = JSON.parse(JSON.stringify(this.allConfig));
    this.allQuestions = [];
    if (this.search != '') {
      setTimeout(() => {
        this.allQuestions = allQuestion.items.filter((o: any) =>
          o.question.toLowerCase().includes(this.search.toLowerCase())
        );
      }, 10);
    } else {
      this.allQuestions = allQuestion.items;
    }
  }
}
