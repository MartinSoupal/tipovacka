import {Component, OnInit} from '@angular/core';
import {Match, MatchWithTeamName} from '../../models/match.model';
import {DataService} from '../../services/data.service';
import {combineLatest, map, of, switchMap} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';
import {Team} from '../../models/team.model';
import {Vote} from '../../models/vote.model';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  groupOfPrevMatches: MatchWithTeamName[][] = [];
  groupOfNextMatches: MatchWithTeamName[][] = [];
  users: User[] = [];
  activeTab: 'previous' | 'next' | 'standings' = 'next';
  loadingNextMatches = true;
  loadingPrevMatches = true;
  loadingStandings = true;
  teamsInHashMap: Record<string, Team> = {};

  constructor(
    private dataService: DataService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.dataService.getTeams()
      .subscribe({
        next: teams => {
          this.teamsInHashMap = arrayToHashMap('id', teams);
          this.loadNextMatches();
          this.loadPrevMatches();
        }
      })
    this.dataService.getStandings()
      .subscribe({
        next: users => {
          this.users = users;
          this.loadingStandings = false;
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
    R.forEach(
      (matches: MatchWithTeamName[]) => {
        R.forEach(
          (match: MatchWithTeamName) => {
            match.vote = null;
          },
          matches,
        );
      },
      this.groupOfPrevMatches,
    );
  }

  private loadNextMatches = () => {
    this.loadingNextMatches = true;
    combineLatest([
      this.dataService.getNextMatches(),
      this.authService.isSignIn$
    ])
      .pipe(
        switchMap(
          ([matches, isSignIn]) =>
            (isSignIn && matches.length ?
              this.dataService.getVotes(R.map(R.prop('id'), matches)) :
              of([]))
              .pipe(
                map((votes): [Match[], Vote[]] => [matches, votes])
              )
        )
      )
      .subscribe({
        next: ([matches, votes]: [Match[], Vote[]]) => {
          const votesInHashMap = arrayToHashMap('matchId', votes);
          this.groupOfNextMatches = R.groupWith(
            (a, b) => a.datetime.getTime() === b.datetime.getTime(),
            R.sort(
              (a, b) => a.datetime.getTime() - b.datetime.getTime(),
              matches.map(
                (match): MatchWithTeamName => ({
                  ...match,
                  homeTeam: this.teamsInHashMap[match.home],
                  awayTeam: this.teamsInHashMap[match.away],
                  daysTill: this.daysDifferenceTillNow(match.datetime),
                  vote: R.defaultTo(null, votesInHashMap[match.id]?.result),
                })
              )
            )
          );
          this.loadingNextMatches = false;
        }
      })
  }

  private loadPrevMatches = () => {
    this.loadingPrevMatches = true;
    combineLatest([
      this.dataService.getPrevMatches(),
      this.authService.isSignIn$
    ])
      .pipe(
        switchMap(
          ([matches, isSignIn]) =>
            (isSignIn && matches.length ?
              this.dataService.getVotes(R.map(R.prop('id'), matches)) :
              of([]))
              .pipe(
                map((votes): [Match[], Vote[]] => [matches, votes])
              )
        )
      )
      .subscribe({
        next: ([matches, votes]: [Match[], Vote[]]) => {
          const votesInHashMap = arrayToHashMap('matchId', votes);
          this.groupOfPrevMatches = R.groupWith(
            (a, b) => a.datetime.getTime() === b.datetime.getTime(),
            R.sort(
              (a, b) => b.datetime.getTime() - a.datetime.getTime(),
              matches.map(
                (match): MatchWithTeamName => ({
                  ...match,
                  homeTeam: this.teamsInHashMap[match.home],
                  awayTeam: this.teamsInHashMap[match.away],
                  daysTill: this.daysDifferenceTillNow(match.datetime),
                  vote: R.defaultTo(null, votesInHashMap[match.id]?.result),
                })
              )
            )
          );
          this.loadingPrevMatches = false;
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
