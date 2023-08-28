import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { LoginFormType } from 'src/app/enums/login-form-type';
import { UserType } from 'src/app/enums/user-type';
import { UserModel } from 'src/app/models/user-model';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CustomValidationService } from 'src/app/services/custom-validation.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('default', { static: true }) password?: TextBoxComponent;

  @Output() closeLoginDialog = new EventEmitter<null>();
  @Output() changeLoginFormTypeEvent = new EventEmitter<any>();
  public type = LoginFormType.login;
  public loginFormType = LoginFormType;
  public user = new UserModel();
  public accountType: UserType = UserType.customer;
  public language: any;
  public registerForm!: FormGroup;
  public submitted = false;
  public showHidePassword = false;
  public needVerification = false;
  public text: any;

  constructor(
    private service: CallApiService,
    private storageService: StorageService,
    private helpService: HelpService,
    private router: Router,
    private toastr: ToastrComponent,
    private fb: FormBuilder,
    private customValidator: CustomValidationService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.type = LoginFormType.login;
    this.initializeForm();
    this.initializeConfig();
  }

  ngAfterViewInit(): void {
    document.onclick = (args: any): void => {
      if (args.target.className === 'e-dlg-overlay') {
        this.closeLoginDialog.emit();
      }
    };
  }

  initializeForm() {
    this.registerForm = this.fb.group(
      {
        company: [''],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        password: [
          '',
          Validators.compose([
            Validators.required,
            this.customValidator.patternValidator(),
          ]),
        ],
        confirmPassword: ['', [Validators.required]],
        type: [this.accountType],
        privacy: [null, Validators.requiredTrue],
        newsletter: [false],
      },
      {
        validator: [
          this.customValidator.MatchPassword('password', 'confirmPassword'),
          this.customValidator.MatchEmail('email', 'confirmEmail'),
        ],
      }
    );
  }

  initializeConfig() {
    this.text = this.helpService.getCustomText();
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  login() {
    this.service
      .callPostMethod('/api/login', this.user)
      .subscribe((data: any) => {
        if (data && data.token) {
          this.setUserInfoAndRoute(data);
        } else if (data.type === 'exist') {
          this.toastr.showErrorCustom(
            this.language.loginIncorrectMailOrPassword,
            ''
          );
        } else if (data.type === 'active') {
          this.toastr.showErrorCustom(this.language.loginAccountNotActive, '');
        } else if (data.type === 'verified') {
          this.needVerification = true;
          this.toastr.showErrorCustom(
            this.language.loginAccountNotVerified,
            ''
          );
        }
      });
  }

  signUp() {
    console.log(this.registerForm);
    this.registerForm.patchValue({ type: this.accountType });
    this.submitted = true;
    if (this.registerForm.valid) {
      this.service
        .callPostMethod('/api/signUp', this.registerForm.value)
        .subscribe((data) => {
          if (data) {
            this.toastr.showSuccessCustom(
              this.language.loginNeedToVerifyAccount
            );
            this.type = LoginFormType.login;
            this.closeLoginDialog.emit();
            this.registerForm.reset();
          } else {
            this.toastr.showWarningCustom(this.language.loginEmailExists, '');
          }
        });
    }
  }

  recoveryPassword() {
    if (this.user.email) {
      this.service
        .callGetMethod('api/recoveryMail', this.user.email)
        .subscribe((data) => {
          if (data) {
            this.toastr.showSuccessCustom(
              this.language.loginSendRecoveryPasswordSuccess
            );
            this.closeLoginDialog.emit();
          } else {
            this.toastr.showErrorCustom(
              this.language.loginNeedToFillRequiredData
            );
          }
        });
    } else {
      this.toastr.showErrorCustom(this.language.loginNeedToFillRequiredData);
    }
  }

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
    } else if (
      this.helpService.getSessionStorageStringValue('previous') === 'checkout'
    ) {
      this.router.navigate(['payment']);
      this.helpService.removeSessionStorage('previous');
    } else if (token.type === UserType.superadmin) {
      // this.router.navigate(['/dashboard']);
      window.location.reload();
    } else {
      window.location.reload();
    }
  }

  selectUserType(type: UserType) {
    this.accountType = type;
    if (this.accountType != this.getUserType().customer) {
      this.registerForm.addControl(
        'telephone',
        new FormControl('', Validators.required)
      );
      // this.fb.control({
      //   telephone: ['', Validators.required],
      // });
    } else {
      this.registerForm.removeControl('telephone');
    }
  }

  getUserType() {
    return UserType;
  }

  changeLoginFormType(event: LoginFormType) {
    this.type = event;
    this.showHidePassword = false;
    this.changeLoginFormTypeEvent.emit(event);
  }

  containsUppercase(value: string) {
    return /[A-Z]/.test(value);
  }

  containsLowercase(value: string) {
    return /[a-z]/.test(value);
  }

  containsNumber(value: string) {
    return /[0-9]/.test(value);
  }

  resentVerificationMail() {
    this.service
      .callPostMethod('api/verificationMailAddress', { email: this.user.email })
      .subscribe((data) => {
        if (data) {
          this.toastr.showSuccessCustom(
            this.language.loginResentMailForVerifyAccount,
            ''
          );
        }
      });
  }
}
