import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {TranslocoService} from '@ngneat/transloco';
import {DataService} from './services/data.service';
import {AuthService} from './services/auth.service';

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
export class AppComponent implements OnInit {
  title = 'tipovacka-app';
  isBrowserInApp = window.navigator.userAgent.includes('FBAN') || window.navigator.userAgent.includes('FBAV') || navigator.userAgent.includes('Instagram') || document.referrer === 'https://l.instagram.com/';
  authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  private dataService = inject(DataService);

  ngOnInit() {
    const browserLang = navigator.language;
    const lang = localStorage.getItem('lang');
    this.translocoService.setActiveLang(lang || browserLang);
    void this.dataService.loadLeagues();
    void this.dataService.loadLastCalculationDate();
    this.authService.isSignIn$
      .subscribe({
        next: (token) => {
          if (token) {
            this.dataService.loadPrevMatches()
              .then(
                () => {
                  this.dataService.loadPrevMatchesVotes();
                }
              )
            this.dataService.loadNextMatches()
              .then(
                () => {
                  this.dataService.loadNextMatchesVotes();
                }
              )
          } else {
            void this.dataService.loadPrevMatches();
            void this.dataService.loadNextMatches();
          }
          this.dataService.loadStandings();
        }
      })
    addEventListener('signOut', () => {
      this.dataService.clearAllMatchesVotes();
    });
  }
}
