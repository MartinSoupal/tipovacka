import {Component, OnInit} from '@angular/core';
import {MatchWithTeamName} from '../../models/match.model';
import {DataService} from '../../services/data.service';
import {combineLatest} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';

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
      .subscribe({
        next: ([teams, matches]) => {
          const teamsInHashMap = arrayToHashMap('id', teams);
          this.groupOfMatches = R.groupWith(
            (a, b) => a.datetime.getTime() === b.datetime.getTime(),
            R.sort(
              (a, b) => a.datetime.getTime() - b.datetime.getTime(),
              matches.map(
                (match): MatchWithTeamName => ({
                  ...match,
                  homeTeam: teamsInHashMap[match.home],
                  awayTeam: teamsInHashMap[match.away],
                  daysTill: this.daysDifferenceTillNow(match.datetime)
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
