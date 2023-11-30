import {Component, Input} from '@angular/core';
import {League, MatchWithTeamName} from '../../models/match.model';
import {clone} from 'ramda';

@Component({
  selector: 'app-matches-overview',
  templateUrl: './matches-overview.component.html',
  styleUrls: ['./matches-overview.component.scss']
})
export class MatchesOverviewComponent {
  @Input() matches: MatchWithTeamName[] = [];
  @Input() leagues: League[] = [];

  leaguesFilter: League[] = [];
  isLeagueInFilter: Record<League, boolean> = {
    FL: false,
    EURO24: false,
  };

  addLeagueToFilter = (league: League) => {
    if (this.isLeagueInFilter[league]) {
      this.isLeagueInFilter[league] = false;
      this.leaguesFilter.splice(this.leaguesFilter.indexOf(league), 1);
    } else {
      this.isLeagueInFilter[league] = true;
      this.leaguesFilter.push(league);
    }
    this.leaguesFilter = clone(this.leaguesFilter);
  }
}
