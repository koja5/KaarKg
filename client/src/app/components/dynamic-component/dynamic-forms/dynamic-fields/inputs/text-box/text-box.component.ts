import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HelpService } from 'src/app/services/help.service';
import { FieldConfig } from '../../../models/field-config';
import { TextBoxComponent as SyncfusionTextBoxComponent } from '@syncfusion/ej2-angular-inputs';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.sass'],
})
export class TextBoxComponent implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  public language: any;
  @ViewChild('default')
  public textareaObj!: SyncfusionTextBoxComponent;

  constructor(private helpService: HelpService) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initializeRows();
  }

  initializeRows() {
    if (this.config.rows) {
      setTimeout(() => {
        this.textareaObj.addAttributes({
          rows: this.config.rows ? this.config.rows : '2',
        });
      }, 50);
    }
  }
}
