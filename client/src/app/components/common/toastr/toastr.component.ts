import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-custom-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
})
export class ToastrComponent implements OnInit {
  private language: any;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  showSuccessCustom(title: string, text?: string) {
    this.toastr.success(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }

  showInfoCustom(title: string, text?: string) {
    this.toastr.info(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }

  showErrorCustom(title: string, text?: string) {
    this.toastr.error(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }
  showWarningCustom(title: string, text?: string) {
    this.toastr.warning(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }

  showSuccess() {
    const language = JSON.parse(localStorage.getItem('language') ?? '{}');
    this.toastr.success(language.generalSuccessfulyExecuteAction, '', {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }

  showInfo() {
    this.toastr.info('Your action executed successfuly!', '', {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }

  showError() {
    const language = JSON.parse(localStorage.getItem('language') ?? '{}');
    this.toastr.error(language.generalErrorExecuteAction, '', {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }
  showWarning() {
    const language = JSON.parse(localStorage.getItem('language') ?? '{}');
    this.toastr.warning(language.generalErrorExecuteAction, '', {
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
    });
  }
}
