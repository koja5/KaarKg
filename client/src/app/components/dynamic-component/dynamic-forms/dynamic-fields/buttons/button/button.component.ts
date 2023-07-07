import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { HelpService } from 'src/app/services/help.service';
import { FieldConfig } from '../../../models/field-config';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() class!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Output() clickEmitter: EventEmitter<any> = new EventEmitter();
  public config: FieldConfig;
  public group: UntypedFormGroup;
  public language: any;

  constructor(private helpService: HelpService) {
    this.config = new FieldConfig();
    this.group = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  clickButton() {
    this.clickEmitter.emit();
  }

  checkRights() {
    return this.helpService.checkRights(this.config.rights);
  }
}
