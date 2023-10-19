import {Component, OnInit} from '@angular/core';
import {Match, MatchWithTeamName} from '../../models/match.model';
import {DataService} from '../../services/data.service';
import {combineLatest, map, switchMap} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';
import {Team} from '../../models/team.model';
import {Vote} from '../../models/vote.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  groupOfMatches: MatchWithTeamName[][] = [];

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    combineLatest([
      this.dataService.getTeams(),
      this.dataService.getMatches(),
    ])
      .pipe(
        switchMap(
          ([teams, matches]: [Team[], Match[]]) =>
            this.dataService.getVotes(R.map(R.prop('id'), matches))
              .pipe(
                map((votes): [Team[], Match[], Vote[]] => [teams, matches, votes])
              )
        )
      )
      .subscribe({
        next: ([teams, matches, votes]: [Team[], Match[], Vote[]]) => {
          const teamsInHashMap = arrayToHashMap('id', teams);
          const votesInHashMap = arrayToHashMap('matchId', votes);
          this.groupOfMatches = R.groupWith(
            (a, b) => a.datetime.getTime() === b.datetime.getTime(),
            R.sort(
              (a, b) => a.datetime.getTime() - b.datetime.getTime(),
              matches.map(
                (match): MatchWithTeamName => ({
                  ...match,
                  homeTeam: teamsInHashMap[match.home],
                  awayTeam: teamsInHashMap[match.away],
                  daysTill: this.daysDifferenceTillNow(match.datetime),
                  vote: R.defaultTo(null, votesInHashMap[match.id]?.result),
                })
              )
            )
          )
        }
      })
  }

  private daysDifferenceTillNow = (date1: Date): number => {

    // Get the difference in milliseconds
    const differenceInMs: number = date1.getTime() - new Date().getTime();

    // Convert the difference from milliseconds to days
    return Math.round(differenceInMs / (1000 * 60 * 60 * 24));
  }
}
