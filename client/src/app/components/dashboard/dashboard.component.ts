import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public collapseMenuItems: string[][] = [];
  public activeParentNode: string[][] = [];
  public activeGroupNode: string[] = [];
  public activeChildrenNode: string[][][] = [];
  public dropDownNavigationMenu: string[] = [];
  public currentActiveNode: any = {
    group: 0,
    parent: 0,
    children: 0,
  };
  public transformContainerPosition = 'transform: translate3d(0px, 0px, 0px)';
  public sidebarClass = '';
  public profileUser = '';
  public mobileSidebarClass = 'display-none';
  public username!: any;
  public type!: any;
  public profileInfo = '';
  public menu: any = [];

  public sidebar = '';
  public sidebarMobile = '';
  public mobileClass = '';
  public profile = '';
  public language: any;
  public allThemes: any;
  public allLanguage: any;
  public imagePath: any = '../../../assets/images/users/defaultUser.png';
  public selectedNode = 'calendar';
  public typeOfDesign = 'vertical';
  public user: any;
  public pathFromUrl: any;
  public subMenuInd = '';
  public sidebarHeight: any;
  public permissionPatientMenu: any;
  public showHideCollapse = [];
  public activeGroup = [];
  public height!: string;
  public layoutOrientation = 'vertical';
  public horizontalSideBar = '';
  public mobile = false;
  public elem: any;
  public isFullScreen = false;
  private socket: any;
  public items: ItemModel[] = [];

  constructor(
    private configurationService: ConfigurationService,
    private helpService: HelpService,
    private router: Router,
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.elem = document.documentElement;
    this.language = this.helpService.getLanguage();
    this.items = [
      {
        text: this.language.dashboardSettings,
        id: 'settings',
      },
      {
        text: this.language.dashboardLogout,
        id: 'logout',
      },
    ];
    this.getUserInfo();
    this.initializeConfigurations();
  }

  initializeConfigurations() {
    this.configurationService
      .getConfiguration('/navigation-menu', 'navigation-menu.json')
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].rights) {
            // if (this.helpService.checkRights(data[i].rights)) {
            //   this.menu.push(data[i]);
            // }
            this.menu.push(data[i]);
          } else if (data[i].menu) {
            for (let j = 0; j < data[i].menu.length; j++) {
              // if (this.helpService.checkRights(data[i].menu[j].rights)) {
              //   this.menu.push(data[i]);
              // }
              this.menu.push(data[i]);
            }
          }
        }
        this.initialCollapseMenu();
      });
  }

  collapseSidebar() {
    if (this.sidebarClass === '') {
      this.sidebarClass = 'sidebar-enable vertical-collpsed';
    } else {
      this.sidebarClass = '';
    }
  }

  collapseHorizontalSidebar() {
    if (this.horizontalSideBar === '') {
      this.horizontalSideBar = 'show';
    } else {
      this.horizontalSideBar = '';
    }
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.isFullScreen = true;
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.isFullScreen = false;
  }

  clickParentActiveNode(i: number, j: number) {
    this.activeParentNode[this.currentActiveNode.group][
      this.currentActiveNode?.parent
    ] = '';
    this.currentActiveNode = { group: i, parent: j, children: 0 };
    this.activeParentNode[i][j] = 'mm-active';
  }

  collapseMenu(i: number, j: number) {
    if (this.collapseMenuItems[i][j] === '') {
      this.collapseMenuItems[i][j] = 'mm-show';
    } else {
      this.collapseMenuItems[i][j] = '';
    }
  }

  clickActiveChildrenNode(i: number, j: number, k: number) {
    this.activeChildrenNode[this.currentActiveNode.group][
      this.currentActiveNode?.parent
    ][this.currentActiveNode?.children] = '';
    this.currentActiveNode = { group: i, parent: j, children: k };
    this.activeChildrenNode[i][j][k] = 'active';
  }

  initialCollapseMenu() {
    this.checkMobileForSidebar();
    for (let i = 0; i < this.menu.length; i++) {
      this.collapseMenuItems[i] = [];
      this.activeParentNode[i] = [];
      this.activeChildrenNode[i] = [];
      for (let j = 0; j < this.menu[i].menu.length; j++) {
        this.collapseMenuItems[i][j] = '';
        this.activeParentNode[i][j] = '';
        if (this.menu[i].menu[j].isDefault) {
          this.activeParentNode[i][j] = 'mm-active';
          this.currentActiveNode = { group: i, parent: j, children: 0 };
        }
        if (this.menu[i].menu[j].children) {
          this.activeChildrenNode[i][j] = [];
          for (let k = 0; k < this.menu[i].menu[j].children.length; k++) {
            this.activeChildrenNode[i][j][k] = '';
            if (this.menu[i].menu[j].children[k].isDefault) {
              this.activeChildrenNode[i][j][k] = 'mm-active';
              this.currentActiveNode = { group: i, parent: j, children: k };
            }
          }
        }
      }
    }
  }

  checkMobileForSidebar() {
    if (!this.helpService.checkMobileDevice()) {
      this.mobileSidebarClass = '';
      this.mobileClass = '';
    } else {
      this.mobileClass = 'mobile';
    }
  }

  openHomePage() {
    this.router.navigate(['./']);
  }

  getUserInfo() {
    const token = this.helpService.getDecodeToken();
    this.username = token.firstname ? token.firstname : token.lastname;
    this.type = this.helpService.getTypeOfName(token.type);
  }

  profileIconSelectEvent(event: MenuEventArgs) {
    switch (event.item.id) {
      case 'settings':
        this.router.navigate(['./settings/change-personal-info']);
        break;
      case 'logout':
        this.logout();
        break;
      default:
        break;
    }
  }

  logout() {
    this.storageService.deleteToken();
    this.router.navigate(['/']);
  }
}
