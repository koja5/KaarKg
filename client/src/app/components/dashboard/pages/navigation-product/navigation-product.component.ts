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
  public groupName!: string;
  public pathProduct = '/forms/user';
  public fileProduct = 'create-navigation-product.json';
  public pathSubproduct = '/forms/user';
  public fileSubproduct = 'create-navigation-subproduct.json';
  public hierarchicalData: any;
  public field: any;
  public data: any;
  public config: any;

  constructor(
    private service: CallApiService,
    private toastr: ToastrComponent,
    private confirmDialogComponent: ConfirmDialogComponent,
    private configurationService: ConfigurationService,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.service
      .callGetMethod('api/getAllNavigationProducts', '')
      .subscribe((products) => {
        this.service
          .callGetMethod('api/getAllNavigationSubproducts', '')
          .subscribe((subproducts) => {
            this.hierarchicalData = this.helpService.packageNavigations(
              products,
              subproducts
            );
            this.field = {
              dataSource: this.hierarchicalData,
              id: 'id',
              text: 'name',
              child: 'subChild',
            };
          });
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

  deleteProduct(data: any) {
    // this.confirmDialogComponent.showDialog();
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
}
