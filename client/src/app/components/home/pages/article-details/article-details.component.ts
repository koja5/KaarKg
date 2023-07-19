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

  constructor(
    private route: ActivatedRoute,
    private service: CallApiService,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.accountType = this.helpService.getAccountTypeId();
    this.getProductDetails();
  }

  getProductDetails() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.callGetMethod('/api/getProductById', id).subscribe((data: any) => {
      this.item = data[0];
    });
  }
}
