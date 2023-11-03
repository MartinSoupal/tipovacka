import {Component, OnInit} from '@angular/core';
import {Match, MatchWithTeamName} from '../../models/match.model';
import {DataService} from '../../services/data.service';
import {combineLatest, map, switchMap} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';
import {Team} from '../../models/team.model';
import {Vote} from '../../models/vote.model';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  groupOfPrevMatches: MatchWithTeamName[][] = [];
  groupOfNextMatches: MatchWithTeamName[][] = [];
  users: User[] = [];
  activeTab: 'previous' | 'next' | 'standings' = 'standings';

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.loadNextMatches();
    this.loadPrevMatches();
    this.dataService.getStandings()
      .subscribe({
        next: users => {
          this.users = users;
        }
      })
    addEventListener('signIn', () => {
      this.loadNextMatches();
      this.loadPrevMatches();
    });

    addEventListener('signOut', () => {
      this.clearVotesFromMatches();
    });
  }

  private clearVotesFromMatches = () => {
    R.forEach(
      (matches: MatchWithTeamName[]) => {
        R.forEach(
          (match: MatchWithTeamName) => {
            match.vote = null;
          },
          matches,
        );
      },
      this.groupOfNextMatches,
    );
  }

  private loadNextMatches = () => {
    combineLatest([
      this.dataService.getTeams(),
      this.dataService.getNextMatches(),
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
          this.groupOfNextMatches = R.groupWith(
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

  private loadPrevMatches = () => {
    combineLatest([
      this.dataService.getTeams(),
      this.dataService.getPrevMatches(),
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
          this.groupOfPrevMatches = R.groupWith(
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
