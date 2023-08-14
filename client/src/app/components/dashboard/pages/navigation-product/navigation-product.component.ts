import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ConfirmDialogComponent } from 'src/app/components/common/confirm-dialog/confirm-dialog.component';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-navigation-product',
  templateUrl: './navigation-product.component.html',
  styleUrls: ['./navigation-product.component.scss'],
})
export class NavigationProductComponent implements OnInit {
  @ViewChild('dialogProduct')
  public dialogProduct!: DialogComponent;
  @ViewChild('dialogProductUpdate')
  public dialogProductUpdate!: DialogComponent;
  @ViewChild('dialogSubproduct')
  public dialogSubproduct!: DialogComponent;
  @ViewChild('dialogSubproductUpdate')
  public dialogSubproductUpdate!: DialogComponent;
  @ViewChild('confirmDialogComponent')
  public confirmDialogComponent!: ConfirmDialogComponent;
  public groupName!: string;
  public pathProduct = '/forms/user';
  public fileProduct = 'create-navigation-product.json';
  public pathSubproduct = '/forms/user';
  public fileSubproduct = 'create-navigation-subproduct.json';
  public hierarchicalData: any;
  public field: any;
  public data: any;
  public config: any;
  public language: any;
  public selectItem: any;
  public buttons: any;

  constructor(
    private service: CallApiService,
    private toastr: ToastrComponent,
    private configurationService: ConfigurationService,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initializeConfirmButton();
    this.initialize();
  }

  initialize() {
    this.service
      .callGetMethod('api/getAllNavigationProducts', '')
      .subscribe((products) => {
        this.hierarchicalData = this.helpService.packageNavigations(products);
        this.field = {
          dataSource: this.hierarchicalData,
          id: 'id',
          text: 'name',
          child: 'subChild',
        };
        console.log(this.field);
      });
  }

  editProduct(data: any) {
    this.data = null;
    this.config = null;
    let path = '';
    let file = '';
    if (data.navigation_product_id) {
      path = this.pathSubproduct;
      file = this.fileSubproduct;
    } else {
      path = this.pathProduct;
      file = this.fileProduct;
    }
    this.configurationService
      .getConfiguration(path, file)
      .subscribe((config) => {
        this.config = config;
        this.data = data;
        setTimeout(() => {
          if (data.navigation_product_id) {
            this.dialogSubproductUpdate.show();
          } else {
            this.dialogProductUpdate.show();
          }
        }, 100);
      });
  }

  deleteProductQuestion(data: any) {
    this.selectItem = data;
    this.confirmDialogComponent.showDialog();
  }

  deleteProduct(data: any) {
    let method = '';
    if (data.navigation_product_id) {
      method = 'deleteNavigationSubproduct';
    } else {
      method = 'deleteNavigationProduct';
    }
    this.service.callPostMethod('/api/' + method, data).subscribe((data) => {
      if (data) {
        this.initialize();
        this.toastr.showSuccess();
      } else {
        this.toastr.showError();
      }
      this.dialogProduct.hide();
    });
  }

  deleteConfirmAnswer(event: any) {
    if (event) {
      this.deleteProduct(this.selectItem);
    }

    this.confirmDialogComponent.hideDialog();
  }

  createNavigationProduct(event: any) {
    this.service
      .callPostMethod('/api/createNavigationProduct', event)
      .subscribe((data) => {
        if (data) {
          this.initialize();
          this.toastr.showSuccess();
        } else {
          this.toastr.showError();
        }
        this.dialogProduct.hide();
      });
  }

  updateNavigationProduct(event: any) {
    this.service
      .callPostMethod('/api/updateNavigationProduct', event)
      .subscribe((data) => {
        if (data) {
          this.initialize();
          this.toastr.showSuccess();
        } else {
          this.toastr.showError();
        }
        this.dialogProductUpdate.hide();
      });
  }

  createNavigationSubproduct(event: any) {
    this.service
      .callPostMethod('/api/createNavigationProduct', event)
      .subscribe((data) => {
        if (data) {
          this.initialize();
          this.toastr.showSuccess();
        } else {
          this.toastr.showError();
        }
        this.dialogSubproduct.hide();
      });
  }

  updateNavigationSubproduct(event: any) {
    this.service
      .callPostMethod('/api/updateNavigationSubproduct', event)
      .subscribe((data) => {
        if (data) {
          this.initialize();
          this.toastr.showSuccess();
        } else {
          this.toastr.showError();
        }
        this.dialogSubproductUpdate.hide();
      });
  }

  initializeConfirmButton() {
    this.buttons = [
      {
        click: this.deleteConfirmAnswer.bind(true),
        buttonModel: {
          content: this.language.confirmDeleteItemYes,
          iconCss: 'fa fa-check',
          isPrimary: true,
        },
      },
      {
        click: this.deleteConfirmAnswer.bind(false),
        buttonModel: {
          content: this.language.confirmDeleteItemNo,
          iconCss: 'fa fa-times',
        },
      },
    ];
  }
}
