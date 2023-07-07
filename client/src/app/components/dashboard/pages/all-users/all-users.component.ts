import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent implements OnInit {
  public path = '/grids/superadmin';
  public file = 'all-users.json';

  constructor() {}

  ngOnInit(): void {}
}
