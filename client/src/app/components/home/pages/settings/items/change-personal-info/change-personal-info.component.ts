import { Component, OnInit } from '@angular/core';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-change-personal-info',
  templateUrl: './change-personal-info.component.html',
  styleUrls: ['./change-personal-info.component.scss'],
})
export class ChangePersonalInfoComponent implements OnInit {
  public path = '/settings';
  public file = 'change-personal-info.json';
  public config: any;
  public data: any;

  constructor(
    private service: CallApiService,
    private configurationService: ConfigurationService,
    private toastr: ToastrComponent
  ) {}

  ngOnInit(): void {
    this.initializeConfig();
    this.initialize();
  }

  initializeConfig() {
    this.configurationService
      .getConfiguration(this.path, this.file)
      .subscribe((config) => {
        this.config = config;
      });
  }

  initialize() {
    this.service.callGetMethod('/api/getMe/', '').subscribe((data) => {
      this.data = data;
    });
  }

  saveConfig(event: any) {
    this.service
      .callPostMethod('/api/changePersonalInfo', event)
      .subscribe((data) => {
        if (data) {
          this.toastr.showSuccess();
        } else {
          this.toastr.showError();
        }
      });
  }
}
