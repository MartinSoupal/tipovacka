import {Component, inject} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {RouterOutlet} from '@angular/router';
import {JsonPipe, NgIf} from '@angular/common';
import {TranslocoService} from '@ngneat/transloco';
import {DataService} from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    NgIf,
    JsonPipe,

  ],
})
export class AppComponent {
  title = 'tipovacka-app';
  isBrowserInApp = window.navigator.userAgent.includes('FBAN') || window.navigator.userAgent.includes('FBAV') || navigator.userAgent.includes('Instagram') || document.referrer === 'https://l.instagram.com/';
  private translocoService = inject(TranslocoService);
  private dataService = inject(DataService);

  constructor() {
    const browserLang = navigator.language;
    const lang = localStorage.getItem('lang');
    this.translocoService.setActiveLang(lang || browserLang);
    const selectedLeagues = localStorage.getItem('selectedLeagues');
    if (selectedLeagues) {
      this.dataService.setSelectedLeagues(JSON.parse(selectedLeagues));
    }
  }
}
