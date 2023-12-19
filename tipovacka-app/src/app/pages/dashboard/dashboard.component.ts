import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {combineLatest} from 'rxjs';

type Tabs = 'results' | 'next' | 'standings';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
            const userLeagueId = queryParams['ul'] as string;
            if (userLeagueId) {
              this.dataService.setSelectedUserLeague(userLeagueId);
            }
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
          this.dataService.loadStandings();
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
