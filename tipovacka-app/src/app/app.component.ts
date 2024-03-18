import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {JsonPipe, NgIf} from '@angular/common';
import {TranslocoService} from '@ngneat/transloco';
import {DataService} from './services/data.service';
import {AuthService} from './services/auth.service';
import {combineLatest} from 'rxjs';

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
export class AppComponent implements OnInit {
  title = 'tipovacka-app';
  isBrowserInApp = window.navigator.userAgent.includes('FBAN') || window.navigator.userAgent.includes('FBAV') || navigator.userAgent.includes('Instagram') || document.referrer === 'https://l.instagram.com/';
  authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const browserLang = navigator.language;
    const lang = localStorage.getItem('lang');
    this.translocoService.setActiveLang(lang || browserLang);
    const selectedLeagues = localStorage.getItem('selectedLeagues');
    if (selectedLeagues) {
      this.dataService.setSelectedLeagues(JSON.parse(selectedLeagues));
    }
    const selectedSeasons = localStorage.getItem('selectedSeasons');
    if (selectedSeasons) {
      this.dataService.setSelectedSeasons(JSON.parse(selectedSeasons));
    }
    void this.dataService.loadLeagues();
    void this.dataService.loadLastCalculationDate();
    void this.dataService.loadSeasons();
    combineLatest([
      this.authService.isSignIn$,
      this.route.queryParams,
    ])
      .subscribe({
        next: ([token, queryParams]) => {
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
      this.dataService.clearUserLeagues();
    });
  }
}
