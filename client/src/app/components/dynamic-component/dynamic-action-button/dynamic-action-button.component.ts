import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { ToastrComponent } from '../common/toastr/toastr.component';
import { FormConfig } from '../dynamic-forms/models/form-config';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-dynamic-action-button',
  templateUrl: './dynamic-action-button.component.html',
  styleUrls: ['./dynamic-action-button.component.scss'],
})
export class DynamicActionButtonComponent implements OnInit {
  @ViewChild('ejDialog') ejDialog!: DialogComponent;

  @Input() data: any;
  @Input() config!: FormConfig;
  @Input() componentType!: string;
  @Input() path!: string;
  @Input() file!: string;
  @Output() refreshFormData = new EventEmitter();
  public language: any;
  public itemsModelDropDown!: ItemModel[];
  public itemsModelSplit!: ItemModel[];
  public modal: boolean = false;
  public loader = false;

  constructor(
    private helpService: HelpService,
    private apiService: CallApiService,
    private toastr: ToastrComponent,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initialize();
  }

  initialize() {
    if (this.config.actionButtons.dropDownButtons) {
      this.itemsModelDropDown = this.config.actionButtons.dropDownButtons
        .items as ItemModel[];
      this.translateItem(this.itemsModelDropDown);
    }
    if (this.config.actionButtons.splitButtons) {
      this.itemsModelSplit = this.config.actionButtons.splitButtons
        .items as ItemModel[];
      this.translateItem(this.itemsModelSplit);
    }
  }

  translateItem(items: any) {
    for (let i = 0; i < items.length; i++) {
      if (this.language[items[i].text]) {
        items[i].text = this.language[items[i].text];
      }
    }
  }

  clickAction(action: any) {
    switch (action.item.properties.id) {
      case 'edit':
        // this.ejDialog.show();
        this.modal = true;
        break;
      case 'delete':
        this.ejDialog.show();
        break;
    }
  }

  checkComponentType() {
    switch (this.componentType) {
      case 'form':
        return true;
      case 'scheduler':
        return true;
      default:
        return false;
    }
  }

  submitEmitter(event: any) {
    this.loader = true;
    console.log(this.data);
    if (this.data && this.data.length) {
      this.callServerMethod(this.config.editSettingsRequest.edit, event);
    } else {
      this.callServerMethod(this.config.editSettingsRequest.add, event);
    }
  }

  callServerMethod(request: any, event: any) {
    this.apiService
      .callServerMethod(request, event, this.router)
      .subscribe((data: any) => {
        if (data) {
          this.toastr.showSuccess();
          this.apiService
            .callApi(this.config, this.router)
            .subscribe((data) => {
              this.setResponseData(data);
            });
        } else {
          this.toastr.showError();
          this.loader = false;
          this.modal = false;
        }
      });
  }

  setResponseData(data: any) {
    this.loader = false;
    this.modal = false;
    if (this.config.request!.type === 'GET') {
      this.data = data;
      this.refreshFormData.emit(this.data);
    }
  }

  closeModal() {
    this.modal = false;
  }

  checkRights() {
    return this.helpService.checkRights(this.config.actionButtons.rights);
  }
}
