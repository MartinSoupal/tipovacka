import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activeTab: 'previous' | 'next' | 'standings' = 'next';
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
          if (!token) {
            return;
          }
          const userLeagueId = queryParams['ul'] as string;
          if (userLeagueId) {
            this.dataService.setSelectedUserLeague(userLeagueId);
          }
          this.dataService.loadPrevMatches();
          this.dataService.loadNextMatches();
          this.dataService.loadUserLeagues();
        }
      })

    addEventListener('signOut', () => {
    });
    this.dataService.loadPrevMatches();
    this.dataService.loadPrevMatchesVotes();
    this.dataService.loadNextMatches();
    this.dataService.loadNextMatchesVotes();
    this.dataService.loadUserLeagues();
    this.dataService.loadStandings();
  }
}
