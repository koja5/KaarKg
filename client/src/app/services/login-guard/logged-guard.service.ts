import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from 'src/app/enums/user-type';
import { HelpService } from '../help.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuardSuperadminService {
  constructor(private router: Router, public helpService: HelpService) {}

  canActivate() {
    if (this.helpService.getUserType() == UserType.superadmin) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
