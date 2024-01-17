import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {combineLatest} from 'rxjs';
import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {NextMatchesComponent} from './next-matches/next-matches.component';
import {
  PreviousMatchesComponent
} from './previous-matches/previous-matches.component';
import {StandingsComponent} from './standings/standings.component';

type Tabs = 'results' | 'next' | 'standings';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    TranslocoPipe,
    AsyncPipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NextMatchesComponent,
    PreviousMatchesComponent,
    StandingsComponent,
    NgIf
  ]
})
export class DashboardComponent implements OnInit {
  activeTab: Tabs = 'next';
  authService = inject(AuthService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
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
          }
          void this.dataService.loadPrevMatches();
          void this.dataService.loadNextMatches();
          const userLeagueId = queryParams['ul'] as string;
          if (userLeagueId) {
            this.dataService.setSelectedUserLeague(userLeagueId);
          }
          if (!userLeagueId) {
            this.dataService.loadStandings();
          }
          this.dataService.loadUserLeagues();
        }
      })
    this.route.paramMap
      .subscribe({
        next: (params) => {
          this.activeTab = (params.get('activeTab') as Tabs) || 'next';
        }
      })

    addEventListener('signOut', () => {
      this.dataService.clearAllMatchesVotes();
      this.dataService.clearUserLeagues();
    });
  }
}
