import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FieldType } from 'src/app/enums/field-type';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';

import { FieldConfig } from './models/field-config';
import { FieldsWithAdditionalInfo } from './models/fields-with-additional-info';
import { FormConfig } from './models/form-config';

@Component({
  exportAs: 'dynamicForm',
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
})
export class DynamicFormsComponent implements OnInit {
  @Input()
  config!: FormConfig;
  @Input()
  additionalInfo!: FieldsWithAdditionalInfo;
  @Input() path!: string;
  @Input() file!: string;
  @Input() hideActionButtons!: boolean;
  @Input() disableEdit!: boolean;
  @Input() partOfGrid!: boolean;
  @Input() data!: any;

  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  form!: FormGroup;
  public loader: boolean = true;
  public modalShow: boolean = false;

  get controls() {
    return this.config.config!.filter(({ type }) => type !== 'button');
  }
  get changes() {
    return this.form.valueChanges;
  }
  get valid() {
    return this.form.valid;
  }
  get value() {
    return this.form.value;
  }

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private apiService: CallApiService,
    private router: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.path && this.file && !this.data) {
      this.initializeConfig();
      this.loader = false;
    } else if (this.data && this.hideActionButtons) {
      this.getConfigurationFile();
      this.loader = false;
    } else {
      this.form = this.createGroup();
      this.loader = false;
      if (!this.partOfGrid) {
        if (this.disableEdit) {
          this.setDisableEdit();
        }
        if (this.config.request && !this.data) {
          this.getData(this.config);
        } else {
          this.setValueToForm(this.config.config, this.data);
        }
      }
    }
  }

  initializeConfig() {
    this.configurationService
      .getConfiguration(this.path, this.file)
      .subscribe((data) => {
        this.config = data as FormConfig;
        if (this.disableEdit) {
          this.setDisableEdit();
        }
        if (this.config.actionButtons) {
          this.setDisableEdit();
        }
        this.form = this.createGroup();
        if (this.config.request && !this.data) {
          this.getData(this.config);
        }
      });
  }

  getConfigurationFile() {
    this.configurationService
      .getConfiguration(this.path, this.file)
      .subscribe((data) => {
        this.config = data as FormConfig;
        this.form = this.createGroup();
        this.setValueToForm(this.config.config, this.data);
      });
  }

  getData(data: any) {
    this.apiService.callApi(data, this.router).subscribe((data) => {
      this.data = data;
      this.setValueToForm(this.config.config, data);
    });
  }

  setDisableEdit() {
    if (this.config.config) {
      for (let i = 0; i < this.config.config.length; i++) {
        this.config.config[i].readonly = true;
        if (
          this.config.config[i].type === 'button' &&
          this.config.config[i].field === 'submit'
        ) {
          this.config.config.splice(i, 1);
        } else if (this.config.config[i].type === 'radio') {
          this.config.config[i].disabled = true;
        }
      }
    }
  }

  // callApi(data: any) {
  //   if (data.request.type === 'POST') {
  //     if (data.request.url) {
  //       data.body = this.helpService.postRequestDataParameters(
  //         data.body,
  //         this.router.snapshot.params,
  //         data.request.url
  //       );
  //     }
  //     this.callApiPost(data.request.api, data.body);
  //   } else {
  //     if (data.request.url) {
  //       const dataValue = this.helpService.getRequestDataParameters(
  //         this.router.snapshot.params,
  //         data.request.url
  //       );
  //       this.callApiGet(data.request.api, dataValue);
  //     } else {
  //       const dataValue = this.helpService.getRequestDataParameters(
  //         this.router.snapshot.params,
  //         data.request.parameters
  //       );
  //       this.callApiGet(data.request.api, dataValue);
  //     }
  //   }
  // }

  callApiPost(api: string, body: any) {
    this.apiService.callPostMethod(api, body).subscribe((data) => {
      this.data = data;
      this.setValueToForm(this.config.config, data);
    });
  }

  callApiGet(api: string, parameters?: string) {
    this.apiService.callGetMethod(api, parameters!).subscribe((data) => {
      this.data = data;
      this.setValueToForm(this.config.config, data);
    });
  }

  ngOnChanges() {
    if (this.form) {
      const controls = Object.keys(this.form.controls);
      const configControls = this.controls.map((item) => item.name);

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control));

      configControls
        .filter((control) => !controls.includes(control!))
        .forEach((name) => {
          const config = this.config.config!.find(
            (control) => control.name === name
          );
          this.form.addControl(name!, this.createControl(config!));
        });
    }
  }

  createGroup() {
    const group = this.fb.group({});
    this.controls.forEach((control) =>
      group.addControl(control.name!, this.createControl(control))
    );
    return group;
  }

  createControl(config: FieldConfig) {
    const { disabled, validation, value } = config;
    return this.fb.control({ disabled, value }, validation);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit(this.value);
    if (this.file === 'personalize.json') {
      this.messageService.sendOrientation(this.value.orientation);
    }
  }

  setDisabled(name: string, disable: boolean) {
    if (this.form.controls[name]) {
      const method = disable ? 'disable' : 'enable';
      this.form.controls[name][method]();
      return;
    }

    this.config.config = this.config.config!.map((item) => {
      if (item.name === name) {
        item.disabled = disable;
      }
      return item;
    });
  }

  setValueToForm(fields: any, values: any) {
    if (values && values.length > 0) {
      for (let k = 0; k < values.length; k++) {
        for (let i = 0; i < fields.length; i++) {
          if (fields[i]['type'] !== FieldType.label) {
            this.setValue(
              fields[i]['name'],
              values[k][fields[i]['name']],
              fields[i]['type']
            );
          }
        }
      }
    } else {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i]['type'] !== FieldType.label && values) {
          this.setValue(
            fields[i]['name'],
            values[fields[i]['name']],
            fields[i]['type']
          );
        }
      }
    }
    this.loader = false;
  }

  setValue(name: string, value: any, type: string) {
    if (name) {
      if (this.form.controls[name]) {
        if (type === 'switch' || type === 'checkbox') {
          this.form.controls[name].setValue(this.convertBooleanValue(value), {
            emitEvent: true,
          });
        } else {
          this.form.controls[name].setValue(value, { emitEvent: true });
        }
      }
    }
  }

  convertBooleanValue(value: number) {
    if (value === 1) {
      return true;
    } else {
      return false;
    }
  }

  refreshFormData(event: any) {
    this.data = event;
    this.setValueToForm(this.config.config, event);
  }
}
