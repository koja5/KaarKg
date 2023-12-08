import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { CustomValidationService } from 'src/app/services/custom-validation.service';
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
  public showHidePassword = false;
  public registerForm!: FormGroup;
  public submitted = false;

  constructor(
    private service: CallApiService,
    private router: ActivatedRoute,
    private toastr: ToastrComponent,
    private helpService: HelpService,
    private redirect: Router,
    private fb: FormBuilder,
    private customValidator: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group(
      {
        password: [
          '',
          Validators.compose([
            Validators.required,
            this.customValidator.patternValidator(),
          ]),
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: [
          this.customValidator.MatchPassword('password', 'confirmPassword'),
          this.customValidator.MatchEmail('email', 'confirmEmail'),
        ],
      }
    );
  }

  recoveryPassword() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.registerForm.value['email'] = this.router.snapshot.params['email'];
      this.service
        .callPostMethod('api/changePasswordRecovery', this.registerForm.value)
        .subscribe((data) => {
          if (data) {
            this.toastr.showSuccessCustom(this.language.passwordIsChanged, '');
            this.redirect.navigate(['/']);
          }
        });
    }
  }

  get registerFormControl() {
    return this.registerForm.controls;
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
