import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from '../help.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedAnyService {
  constructor(
    public router: Router,
    public storageService: StorageService,
    public helpService: HelpService
  ) {}

  canActivate() {
    if (this.storageService.getToken()) {
      return true;
    } else {
      this.helpService.setLocalStorage('previousLink', window.location.hash);
      this.router.navigate(['/']);
      return false;
    }
  }
}
