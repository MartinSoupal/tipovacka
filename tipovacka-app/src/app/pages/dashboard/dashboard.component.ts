import {Component, OnInit} from '@angular/core';
import {Match, MatchWithTeamName} from '../../models/match.model';
import {DataService} from '../../services/data.service';
import {combineLatest, map, of, switchMap} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';
import {includes} from 'ramda';
import {Team} from '../../models/team.model';
import {Vote} from '../../models/vote.model';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {UserLeague} from '../../models/user-league.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  groupOfPrevMatches: MatchWithTeamName[] = [];
  leaguesOfPrevMatches: string[] = [];
  nextMatches: MatchWithTeamName[] = [];
  leaguesOfNextMatches: string[] = [];
  users: User[] = [];
  activeTab: 'previous' | 'next' | 'standings' = 'standings';
  loadingNextMatches = true;
  loadingPrevMatches = true;
  loadingStandings = true;
  teamsInHashMap: Record<string, Team> = {};
  userLeagues: UserLeague[] = [];

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
    this.loadAllUserLeague();
    addEventListener('signIn', () => {
      this.loadNextMatches();
      this.loadPrevMatches();
      this.loadAllUserLeague();
    });

    addEventListener('signOut', () => {
      this.clearVotesFromMatches();
      this.userLeagues = [];
    });
  }

  private clearVotesFromMatches = () => {
    R.forEach(
      (match: MatchWithTeamName) => {
        match.vote = null;
      },
      this.nextMatches,
    );
    R.forEach(
      (match: MatchWithTeamName) => {
        match.vote = null;
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
          this.nextMatches =
            R.sortWith<MatchWithTeamName>([
              R.ascend(R.prop('datetime')),
              R.ascend(R.prop('league')),
              R.ascend(R.prop('stage')),
              R.ascend(R.prop('round')),
            ])(matches.map(
              (match): MatchWithTeamName => {
                if (!includes(match.league, this.leaguesOfNextMatches)) {
                  this.leaguesOfNextMatches.push(match.league);
                }
                return {
                  ...match,
                  homeTeam: this.teamsInHashMap[match.home],
                  awayTeam: this.teamsInHashMap[match.away],
                  daysTill: this.daysDifferenceTillNow(match.datetime),
                  vote: R.defaultTo(null, votesInHashMap[match.id]?.result),
                }
              },
              matches
            ))
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
          this.groupOfPrevMatches =
            R.sortWith<MatchWithTeamName>([
              R.descend(R.prop('datetime')),
              R.ascend(R.prop('league')),
              R.ascend(R.prop('stage')),
              R.ascend(R.prop('round')),
            ])(
              matches.map(
                (match): MatchWithTeamName => {
                  if (!includes(match.league, this.leaguesOfPrevMatches)) {
                    this.leaguesOfPrevMatches.push(match.league);
                  }
                  return {
                    ...match,
                    homeTeam: this.teamsInHashMap[match.home],
                    awayTeam: this.teamsInHashMap[match.away],
                    daysTill: this.daysDifferenceTillNow(match.datetime),
                    vote: R.defaultTo(null, votesInHashMap[match.id]?.result),
                  }
                },
              ))
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

  private loadAllUserLeague = () => {
    this.dataService.getAllUserLeagues()
      .subscribe({
        next: userLeagues => {
          this.userLeagues = userLeagues;
        }
      })
  }
}
