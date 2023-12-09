import {Component, Input} from '@angular/core';
import {MatchWithTeamName} from '../../models/match.model';
import {clone} from 'ramda';
import {Vote} from '../../models/vote.model';

@Component({
  selector: 'app-matches-overview',
  templateUrl: './matches-overview.component.html',
  styleUrls: ['./matches-overview.component.scss']
})
export class MatchesOverviewComponent {
  @Input() matches: MatchWithTeamName[] = [];
  @Input() leagues: string[] = [];
  @Input() votes: Record<string, Vote | undefined> = {};
  leaguesFilter: string[] = [];
  isLeagueInFilter: Record<string, boolean> = {};

  @Input()
  set selectedFilterLeagues(leagues: string[] | undefined) {
    if (!leagues?.length) {
      return;
    }
    leagues.forEach(this.addLeagueToFilter);
  }

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
}
