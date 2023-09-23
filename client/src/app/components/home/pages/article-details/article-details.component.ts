import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
})
export class ArticleDetailsComponent implements OnInit {
  public item: any;
  public accountType: number | undefined;
  public language: any;

  constructor(
    private route: ActivatedRoute,
    private service: CallApiService,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.accountType = this.helpService.getAccountTypeId();
    this.language = this.helpService.getLanguage();
    this.getProductDetails();
  }

  getProductDetails() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (this.helpService.getAccountTypeId() != -1) {
      this.service
        .callGetMethod('/api/getProductByIdForLoginUser', id)
        .subscribe((data: any) => {
          if (data) {
            this.item = data[0];
          }
        });
    } else {
      this.service
        .callGetMethod('/api/getProductById', id)
        .subscribe((data: any) => {
          if (data) {
            this.item = data[0];
          }
        });
    }
  }
}
