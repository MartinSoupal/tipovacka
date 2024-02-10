import {Component, Input} from '@angular/core';
import {clone} from 'ramda';
import {Vote} from '../../models/vote.model';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DateToNumberPipe} from '../../pipes/date-to-number.pipe';
import {TranslocoPipe} from '@ngneat/transloco';
import {DatetimeFormatPipe} from '../../pipes/datetime-format.pipe';
import {MatchComponent} from '../match/match.component';
import {FilterMatchesByPipe} from '../../pipes/filter-matches-by.pipe';
import {Fixture} from '../../models/fixture.model';

@Component({
  selector: 'app-matches-overview',
  templateUrl: './matches-overview.component.html',
  styleUrls: ['./matches-overview.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    DateToNumberPipe,
    TranslocoPipe,
    DatetimeFormatPipe,
    MatchComponent,
    FilterMatchesByPipe
  ]
})
export class MatchesOverviewComponent {
  @Input() matches: Fixture[] = [];
  @Input() leagues: string[] = [];
  @Input() votes?: Record<string, Vote | undefined>;
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
