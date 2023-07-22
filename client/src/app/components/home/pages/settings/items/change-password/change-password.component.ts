import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public path = '/settings';
  public file = 'change-password.json';

  constructor() {}

  ngOnInit(): void {}
}
