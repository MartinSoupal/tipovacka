import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activeTab: 'previous' | 'next' | 'standings' = 'next';
  authService = inject(AuthService);
  private dataService = inject(DataService);

  ngOnInit() {
    addEventListener('signIn', () => {
      this.dataService.loadPrevMatches();
      this.dataService.loadNextMatches();
      this.dataService.loadUserLeagues();
    });

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
