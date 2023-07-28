import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { LoginFormType } from 'src/app/enums/login-form-type';
import { UserType } from 'src/app/enums/user-type';
import { UserModel } from 'src/app/models/user-model';
import { CallApiService } from 'src/app/services/call-api.service';
import { CustomValidationService } from 'src/app/services/custom-validation.service';
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
  public registerForm!: UntypedFormGroup;
  public submitted = false;

  constructor(
    private service: CallApiService,
    private storageService: StorageService,
    private helpService: HelpService,
    private router: Router,
    private toastr: ToastrComponent,
    private fb: UntypedFormBuilder,
    private customValidator: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group(
      {
        company: [''],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', Validators.required],
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
        validator: this.customValidator.MatchPassword(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  get registerFormControl() {
    return this.registerForm.controls;
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

  containsUppercase(value: string) {
    return /[A-Z]/.test(value);
  }

  containsLowercase(value: string) {
    return /[a-z]/.test(value);
  }

  containsNumber(value: string) {
    return /[0-9]/.test(value);
  }
}
