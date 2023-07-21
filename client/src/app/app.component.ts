import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CallApiService } from './services/call-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  title = 'client';
  public data: any;


  constructor() {}

  ngOnInit() {
  }
}
