import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
})
export class RecoveryPasswordComponent implements OnInit {
  public data = {
    password: '',
    repetPassword: '',
    email: '',
  };
  public language: any;

  constructor(
    private service: CallApiService,
    private router: ActivatedRoute,
    private toastr: ToastrComponent,
    private helpService: HelpService,
    private redirect: Router
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  recoveryPassword() {
    if (this.data.password != this.data.repetPassword) {
      this.toastr.showErrorCustom(this.language.passwordIsNotSame, '');
    } else {
      this.data.email = this.router.snapshot.params['email'];
      this.service
        .callPostMethod('api/changePassword', this.data)
        .subscribe((data) => {
          if (data) {
            this.toastr.showSuccessCustom(this.language.passwordIsChanged, '');
            this.redirect.navigate(['/login']);
          }
        });
    }
  }
}
