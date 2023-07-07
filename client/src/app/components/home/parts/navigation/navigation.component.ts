import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  public navigations: any;
  public showChildren!: string;
  public selectNavigationItem!: string;
  public language: any;

  constructor(
    private service: CallApiService,
    private helpService: HelpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectNavigationItem = this.route.snapshot.paramMap.get('category')!;
    this.initialize();
  }

  initialize() {
    this.service
      .callGetMethod('api/getAllNavigationProducts', '')
      .subscribe((products) => {
        this.language = this.helpService.getLanguage();
        this.navigations = this.repackNavigationMenu(
          this.groupBy(products, 'category_id')
        );
      });
  }

  groupBy(arr: any, property: any) {
    return arr.reduce(function (memo: any, x: any) {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, []);
  }

  repackNavigationMenu(navigation: any) {
    let navigationArray: any[] = [];
    navigation.forEach((item: any) => {
      if (item.length > 1) {
        let parent = item[0];
        let subChildren = [];
        for (let i = 1; i < item.length; i++) {
          subChildren.push(item[i]);
        }

        parent['subChildren'] = subChildren;
        item.splice(1, item.length);
        navigationArray.push(item[0]);
      } else {
        item[0]['subChildren'] = [];
        navigationArray.push(item[0]);
      }
    });
    return navigationArray;
  }
}
