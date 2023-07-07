import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-icon',
  templateUrl: './dynamic-icon.component.html',
  styleUrls: ['./dynamic-icon.component.scss'],
})
export class DynamicIconComponent implements OnInit {
  @Input() icon!: string;

  constructor() {}

  ngOnInit(): void {}
}
