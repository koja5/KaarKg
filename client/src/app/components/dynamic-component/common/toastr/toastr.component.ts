import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
})
export class ToastrComponent implements OnInit {
  private language: any;

  constructor(
    private toastr: ToastrService,
    private helpService: HelpService
  ) {}

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
    this.toastr.success(
      this.helpService.getLanguage().toastrSuccessExecutedActionText,
      this.helpService.getLanguage().toastrSuccessExecutedActionTitle,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }

  showInfo() {
    this.toastr.info(
      this.helpService.getLanguage().toastrInfoExecutedActionText,
      this.helpService.getLanguage().toastrInfoExecutedActionTitle,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }

  showError() {
    this.toastr.error(
      this.helpService.getLanguage().toastrErrorExecutedActionText,
      this.helpService.getLanguage().toastrErrorExecutedActionTitle,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }
  showWarning() {
    this.toastr.warning(
      this.helpService.getLanguage().toastrWarningExecutedActionTitle,
      this.helpService.getLanguage().toastrWarningExecutedActionText,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }
}
