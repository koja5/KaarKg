import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { LoginFormType } from 'src/app/enums/login-form-type';
import { UserType } from 'src/app/enums/user-type';
import { UserModel } from 'src/app/models/user-model';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() closeLoginDialog = new EventEmitter<null>();
  @Output() changeLoginFormTypeEvent = new EventEmitter<any>();
  public type = LoginFormType.login;
  public loginFormType = LoginFormType;
  public user = new UserModel();
  public accountType: UserType = UserType.customer;
  public language: any;

  constructor(
    private service: CallApiService,
    private storageService: StorageService,
    private helpService: HelpService,
    private router: Router,
    private toastr: ToastrComponent
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  login() {
    this.service.callPostMethod('/api/login', this.user).subscribe((data) => {
      if (data) {
        this.setUserInfoAndRoute(data);
      } else {
        this.toastr.showErrorCustom('Incorrect mail or password!', '');
      }
    });
  }

  signUp() {
    if (this.user.password != this.user.repeatPassword) {
      this.toastr.showErrorCustom('Password is not equaly!', '');
    } else {
      this.service
        .callPostMethod('/api/signUp', this.user)
        .subscribe((data) => {
          if (data) {
            this.toastr.showSuccessCustom(
              'You successfuly created account! Please check your mail to verify!'
            );
            this.type = LoginFormType.login;
          } else {
            this.toastr.showError();
          }
          this.closeLoginDialog.emit();
        });
    }
  }

  recoveryPassword() {}

  setUserInfoAndRoute(data: any) {
    this.storageService.setToken(data.token);
    const token = this.helpService.getDecodeToken();
    this.helpService.setLocalStorage('logo', token.logo);
    if (this.helpService.getLocalStorageStringValue('previousLink')) {
      const checkSharp = this.helpService
        .getLocalStorageStringValue('previousLink')
        ?.split('#');
      this.router.navigate([
        checkSharp && checkSharp?.length > 1
          ? checkSharp[1]
          : checkSharp
          ? checkSharp[0]
          : '',
      ]);
    } else if (token.type === UserType.superadmin) {
      this.router.navigate(['/dashboard']);
    } else {
      window.location.reload();
    }
  }

  selectUserType(type: UserType) {
    this.accountType = type;
  }

  getUserType() {
    return UserType;
  }

  changeLoginFormType(event: LoginFormType) {
    this.type = event;
    this.changeLoginFormTypeEvent.emit(event);
  }
}
