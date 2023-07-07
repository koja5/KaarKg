import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss'],
})
export class CookieComponent implements OnInit {
  @Output() public cookieEmitter = new EventEmitter<null>();
  public language: any;

  constructor(
    private storageService: StorageService,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
  }

  acceptCookie() {
    this.storageService.setCookie('cookie', true);
    this.cookieEmitter.emit();
  }
}
