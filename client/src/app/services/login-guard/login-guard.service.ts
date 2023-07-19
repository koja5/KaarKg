import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from '../help.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardService {
  constructor(
    public router: Router,
    public storageService: StorageService,
    public helpService: HelpService
  ) {}

  canActivate() {
    if (
      this.storageService.getToken() &&
      this.helpService.getAccountTypeId() === 0
    ) {
      return true;
    } else {
      console.log(window.location);
      this.helpService.setLocalStorage('previousLink', window.location.hash);
      this.router.navigate(['/']);
      return false;
    }
  }
}
