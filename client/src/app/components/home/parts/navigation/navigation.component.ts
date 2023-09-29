import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Output() public closeNavigation = new EventEmitter<null>();

  public navigations: any;
  public showChildren!: string;
  public selectNavigationItem!: string;
  public language: any;
  public subscribeCloseNavigation!: Subscription;
  public text: any;

  constructor(
    private service: CallApiService,
    public helpService: HelpService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (window.location.pathname.indexOf('category') != -1) {
      this.selectNavigationItem =
        window.location.pathname.split('category/')[1];
    }
    this.text = this.helpService.getCustomText();
    this.initialize();

    this.subscribeCloseNavigation = this.messageService
      .getHideDialog()
      .subscribe(() => {
        this.closeNavigation.emit();
      });
  }

  ngOnDestroy() {
    this.subscribeCloseNavigation.unsubscribe();
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

  clickNavigation(item: string) {
    this.selectNavigationItem = item;
    this.closeNavigation.emit();
  }
}
