import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-personal-info',
  templateUrl: './change-personal-info.component.html',
  styleUrls: ['./change-personal-info.component.scss'],
})
export class ChangePersonalInfoComponent implements OnInit {
  public path = '/settings';
  public file = 'change-personal-info.json';

  constructor() {}

  ngOnInit(): void {}
}
