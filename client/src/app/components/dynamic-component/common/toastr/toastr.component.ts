import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-dynamic-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
})
export class ToastrDynamicComponent implements OnInit {
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
      this.helpService.getLanguage().generalSuccessExecutedActionText,
      this.helpService.getLanguage().generalSuccessExecutedActionTitle,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }

  showInfo() {
    this.toastr.info(
      this.helpService.getLanguage().generalInfoExecutedActionText,
      this.helpService.getLanguage().generalInfoExecutedActionTitle,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }

  showError() {
    this.toastr.error(
      this.helpService.getLanguage().generalErrorExecutedActionText,
      this.helpService.getLanguage().generalErrorExecutedActionTitle,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }
  showWarning() {
    this.toastr.warning(
      this.helpService.getLanguage().generalWarningExecutedActionTitle,
      this.helpService.getLanguage().generalWarningExecutedActionText,
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-right',
      }
    );
  }
}
