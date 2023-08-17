import { Component, OnInit } from '@angular/core';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-mail-approve-dealer-config',
  templateUrl: './mail-approve-dealer-config.component.html',
  styleUrls: ['./mail-approve-dealer-config.component.scss'],
})
export class MailApproveDealerConfigComponent implements OnInit {
  public path = '/forms/mail-config';
  public file = 'approve-dealer.json';
  public data: any;
  public config: any;

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
    this.service
      .callGetMethod('api/save/readFile', this.file)
      .subscribe((data) => {
        this.data = data;
      });
  }

  saveConfig(event: any) {
    const body = {
      data: event,
      file: this.file,
    };
    this.service
      .callPostMethod('/api/save/saveFile/', body)
      .subscribe((data) => {
        if (data) {
          this.toastr.showSuccess();
        } else {
          this.toastr.showError();
        }
      });
  }
}
