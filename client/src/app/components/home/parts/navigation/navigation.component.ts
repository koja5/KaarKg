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

  constructor(
    private service: CallApiService,
    private helpService: HelpService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.selectNavigationItem = this.route.snapshot.paramMap.get('category')!;
    this.initialize();

    this.subscribeCloseNavigation = this.messageService.getHideDialog().subscribe(() => {
      this.closeNavigation.emit();
    });
  }

  ngOnDestroy() {
    this.subscribeCloseNavigation.unsubscribe();
  }

  // ngAfterViewInit(): void {
  //   document.onclick = (args: any): void => {
  //     console.log(args.target.className);
  //     if (args.target.className.indexOf('home-action-button') ||
  //       args.target.className === 'col-lg-9' ||
  //       args.target.className === 'container-fluid' ||
  //       args.target.className === 'products-container' ||
  //       args.target.className === '' ||
  //       args.target.className === 'products-slider owl-theme row' ||
  //       args.target.className === 'product-details' ||
  //       args.target.className === 'btn-quickview' ||
  //       args.target.className ===
  //         'footer-bottom d-sm-flex align-items-center' ||
  //       args.target.className === 'info-box info-box-icon-left pointer'
  //     ) {
  //       this.closeNavigation.emit();
  //     } else if (args.target.className === 'e-dlg-overlay') {
  //       this.messageService.sentHideDialog();
  //     }
  //   };
  // }

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
