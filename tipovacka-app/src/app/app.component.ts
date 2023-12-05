import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tipovacka-app';
  isBrowserInApp = window.navigator.userAgent.includes('FBAN') || window.navigator.userAgent.includes('FBAV');
}
