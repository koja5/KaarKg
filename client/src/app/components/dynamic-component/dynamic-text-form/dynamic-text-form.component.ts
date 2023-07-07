import { Component, Input, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-dynamic-text-form',
  templateUrl: './dynamic-text-form.component.html',
  styleUrls: ['./dynamic-text-form.component.scss'],
})
export class DynamicTextFormComponent implements OnInit {
  @Input() type!: string;
  public language: any;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.helpService
      .getLanguageFromFolder('germany', this.type)
      .subscribe((data) => {
        this.language = data;
      });
  }
}
