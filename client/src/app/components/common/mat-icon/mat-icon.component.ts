import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mat-icon',
  templateUrl: './mat-icon.component.html',
  styleUrls: ['./mat-icon.component.scss']
})
export class MatIconComponent implements OnInit {

  @Input() icon!: string;
  @Input() class!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
