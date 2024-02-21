import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {combineLatest} from 'rxjs';
import {
  AsyncPipe,
  NgClass,
  NgForOf,
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
import {clone} from 'ramda';

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
    NgIf,
    NgForOf
  ]
})
export class DashboardComponent implements OnInit {
  activeTab: Tabs = 'next';
  authService = inject(AuthService);
  dataService = inject(DataService);
  leaguesFilter: string[] = [];
  isLeagueInFilter: Record<string, boolean> = {};
  private route = inject(ActivatedRoute);

  addLeagueToFilter = (league: string) => {
    if (this.isLeagueInFilter[league]) {
      this.isLeagueInFilter[league] = false;
      this.leaguesFilter.splice(this.leaguesFilter.indexOf(league), 1);
    } else {
      this.isLeagueInFilter[league] = true;
      this.leaguesFilter.push(league);
    }
    this.leaguesFilter = clone(this.leaguesFilter);
  }

  ngOnInit() {
    void this.dataService.loadLeagues();
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
