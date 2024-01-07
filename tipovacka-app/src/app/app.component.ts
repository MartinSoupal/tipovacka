import {Component, inject} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    NgIf,

  ],
})
export class AppComponent {
  title = 'tipovacka-app';
  isBrowserInApp = window.navigator.userAgent.includes('FBAN') || window.navigator.userAgent.includes('FBAV');
  private translocoService = inject(TranslocoService);

  constructor() {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translocoService.setActiveLang(lang);
    }
  }
}
