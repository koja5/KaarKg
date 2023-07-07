import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { HelpService } from 'src/app/services/help.service';
import { FieldConfig } from '../../../models/field-config';

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.scss']
})
export class DatetimepickerComponent implements OnInit {

  public config: FieldConfig;
  public group: UntypedFormGroup;
  public language: any;

  constructor(private helpService: HelpService) {
    this.config =  new FieldConfig();
    this.group = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initialization();
  }

  initialization() {
  }
  

}
