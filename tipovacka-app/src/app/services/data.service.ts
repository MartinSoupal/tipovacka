import {inject, Injectable} from '@angular/core';
import {Team} from '../models/team.model';
import {MatchWithTeamName} from '../models/match.model';
import {
  BehaviorSubject,
  combineLatest,
  first,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import * as R from 'ramda';
import {User} from '../models/user.model';
import {NewUserLeague, UserLeague} from '../models/user-league.model';
import {arrayToHashMap} from '../utils/arrayToHashMap.fnc';
import {ApiService, returnIdValue} from './api.service';
import {AuthService} from './auth.service';
import {Vote, VoteResult} from '../models/vote.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  prevMatches$ = new BehaviorSubject<MatchWithTeamName[] | undefined>(undefined);
  leaguesOfPrevMatches$ = new BehaviorSubject<string[]>([]);
  votesOfPrevMatches$ = new BehaviorSubject<Record<string, Vote | undefined>>({});
  nextMatches$ = new BehaviorSubject<MatchWithTeamName[] | undefined>(undefined);
  leaguesOfNextMatches$ = new BehaviorSubject<string[]>([]);
  votesOfNextMatches$ = new BehaviorSubject<Record<string, Vote>>({});
  standings$ = new BehaviorSubject<User[] | undefined>(undefined);
  userLeagues$ = new BehaviorSubject<UserLeague[] | undefined>(undefined);
  selectedUserLeague$ = new BehaviorSubject<UserLeague | undefined>(undefined);
  private teamsInHashMap?: Record<string, Team>;

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  loadPrevMatchesVotes = () => {
    this.prevMatches$
      .pipe(
        switchMap(
          (matches) =>
            (matches?.length ?
              this.apiService.getVotes(R.map(R.prop('id'), matches)) :
              of([]))
        )
      )
      .subscribe({
        next: (votes) => {
          this.votesOfPrevMatches$.next(arrayToHashMap('matchId', votes));
        }
      });
  }

  loadNextMatchesVotes = () => {
    this.nextMatches$
      .pipe(
        switchMap(
          (matches) =>
            (matches?.length ?
              this.apiService.getVotes(R.map(R.prop('id'), matches)) :
              of([]))
        )
      )
      .subscribe({
        next: (votes) => {
          this.votesOfNextMatches$.next(arrayToHashMap('matchId', votes));
        }
      });
  }


  loadPrevMatches = () => {
    combineLatest([
      this.loadAllTeams(),
      this.apiService.getPrevMatches(),
    ])
      .pipe(
        first()
      )
      .subscribe({
        next: ([teamsInHashMap, matches]) => {
          const leaguesOfPrevMatches: string[] = [];
          const prevMatches = R.sortWith<MatchWithTeamName>([
            R.descend(R.prop('datetime')),
            R.ascend(R.prop('league')),
            R.ascend(R.prop('stage')),
            R.ascend(R.prop('round')),
          ])(
            matches.map(
              (match): MatchWithTeamName => {
                if (!R.includes(match.league, leaguesOfPrevMatches)) {
                  leaguesOfPrevMatches.push(match.league);
                }
                return {
                  ...match,
                  homeTeam: teamsInHashMap[match.home],
                  awayTeam: teamsInHashMap[match.away],
                  daysTill: this.daysDifferenceTillNow(match.datetime),
                }
              },
            ))
          this.leaguesOfPrevMatches$.next(leaguesOfPrevMatches);
          this.prevMatches$.next(prevMatches);
        }
      })
  }

  loadNextMatches = () => {
    combineLatest([
      this.loadAllTeams(),
      this.apiService.getNextMatches(),
    ])
      .pipe(
        first()
      )
      .subscribe({
        next: ([teamsInHashMap, matches]) => {
          const leaguesOfNextMatches: string[] = [];
          const nextMatches = R.sortWith<MatchWithTeamName>([
            R.ascend(R.prop('datetime')),
            R.ascend(R.prop('league')),
            R.ascend(R.prop('stage')),
            R.ascend(R.prop('round')),
          ])(
            matches.map(
              (match): MatchWithTeamName => {
                if (!R.includes(match.league, leaguesOfNextMatches)) {
                  leaguesOfNextMatches.push(match.league);
                }
                return {
                  ...match,
                  homeTeam: teamsInHashMap[match.home],
                  awayTeam: teamsInHashMap[match.away],
                  daysTill: this.daysDifferenceTillNow(match.datetime),
                }
              },
            ))
          this.leaguesOfNextMatches$.next(leaguesOfNextMatches);
          this.nextMatches$.next(nextMatches);
        }
      })
  }

  loadStandings = () => {
    this.standings$.next(undefined);
    this.selectedUserLeague$
      .pipe(
        first()
      )
      .subscribe({
        next: (selectedUserLeague) => {
          (selectedUserLeague ?
            this.apiService.getStandingsForUserLeague(selectedUserLeague.id) :
            this.apiService.getStandings())
            .subscribe({
              next: (users) => {
                this.standings$.next(users);
              }
            })
        }
      })
  }

  loadUserLeagues = () => {
    this.authService.isSignIn$
      .pipe(
        first(),
      )
      .subscribe({
        next: (token) => {
          if (!token) {
            return;
          }
          this.apiService.getAllUserLeagues()
            .pipe(
              first(),
            )
            .subscribe({
              next: (userLeagues) => {
                this.userLeagues$.next(userLeagues);
              }
            })
        }
      })
  }

  addUserLeague = (newUserLeague: NewUserLeague): Observable<returnIdValue> =>
    combineLatest([
      this.apiService.addUserLeague(newUserLeague),
      this.userLeagues$,
    ])
      .pipe(
        first(),
        map(
          ([{id}, userLeagues]) => {
            this.userLeagues$.next([
              ...(userLeagues || []),
              {
                id,
                hasAdminRights: true,
                ...newUserLeague,
              }
            ]);
            return {id};
          }
        )
      )

  deleteUserLeague = (userLeagueId: string): Observable<void> =>
    combineLatest([
      this.apiService.deleteUserLeague(userLeagueId),
      this.userLeagues$,
    ])
      .pipe(
        first(),
        map(
          ([_, userLeagues]) => {
            if (!userLeagues?.length) {
              return;
            }
            const userLeagueIndex = R.findIndex(R.propEq(userLeagueId, 'id'), userLeagues);
            this.userLeagues$.next(R.remove(userLeagueIndex, 1, userLeagues));
            return;
          }
        )
      )

  leaveUserLeague = (userLeagueId: string): Observable<void> =>
    combineLatest([
      this.apiService.leaveUserLeague(userLeagueId),
      this.userLeagues$,
    ])
      .pipe(
        first(),
        map(
          ([_, userLeagues]) => {
            if (!userLeagues?.length) {
              return;
            }
            const userLeagueIndex = R.findIndex(R.propEq(userLeagueId, 'id'), userLeagues);
            this.userLeagues$.next(R.remove(userLeagueIndex, 1, userLeagues));
            return;
          }
        )
      )

  joinUserLeague = (userLeagueId: string): Observable<void> =>
    this.apiService.joinUserLeague(userLeagueId)
      .pipe(
        first(),
        map(
          () => {
            return;
          }
        )
      )

  addVote = (matchId: string, result: VoteResult): Observable<returnIdValue> =>
    combineLatest([
      this.apiService.addVote(matchId, result),
      this.votesOfNextMatches$,
      this.nextMatches$,
    ])
      .pipe(
        first(),
        map(
          ([{id}, votes, matches]) => {
            const previousVote: Vote | undefined = votes[matchId];
            this.votesOfNextMatches$.next({
              ...votes,
              matchId: {
                id,
                matchId,
                result,
              }
            });
            this.nextMatches$.next(
              R.map(
                (match) => {
                  if (match.id === matchId) {
                    if (previousVote === undefined) {
                      match.totalVotes++;
                      match[result]++;
                    }
                    if (previousVote !== undefined) {
                      match[previousVote.result]--;
                      match[result]++;
                    }
                  }
                  return match;
                },
                matches!,
              )
            )
            return {id};
          }
        )
      )

  deleteVote = (matchId: string): Observable<void> =>
    combineLatest([
      this.apiService.deleteVote(matchId),
      this.votesOfNextMatches$,
      this.nextMatches$,
    ])
      .pipe(
        first(),
        map(
          ([_, votes, matches]) => {
            const previousVote: Vote | undefined = votes[matchId];
            this.votesOfNextMatches$.next(R.omit([matchId], votes));
            this.nextMatches$.next(
              R.map(
                (match) => {
                  if (match.id === matchId) {
                    match[previousVote.result]--;
                    match.totalVotes--;
                  }
                  return match;
                },
                matches!,
              )
            )
            return;
          }
        )
      )

  setSelectedUserLeague = (selectedUserLeague?: UserLeague | string) => {
    combineLatest([
      this.selectedUserLeague$,
      typeof selectedUserLeague === 'string' ?
        this.apiService.getUserLeague(selectedUserLeague) :
        of(selectedUserLeague)
    ])
      .pipe(
        first()
      )
      .subscribe({
        next: ([actualSelectedUserLeague, newSelectedUserLeague]) => {
          if (actualSelectedUserLeague?.id !== newSelectedUserLeague?.id) {
            this.selectedUserLeague$.next(newSelectedUserLeague);
            this.loadStandings();
          }
        }
      })
  }

  private loadAllTeams = () => new Promise<Record<string, Team>>((resolve) => {
    if (this.teamsInHashMap) {
      resolve(this.teamsInHashMap);
    } else {
      this.apiService.getTeams()
        .subscribe({
          next: teams => {
            this.teamsInHashMap = arrayToHashMap('id', teams);
            resolve(this.teamsInHashMap);
          }
        })
    }
  })

  private daysDifferenceTillNow = (date1: Date): number => {

    // Get the difference in milliseconds
    const differenceInMs: number = date1.getTime() - new Date().getTime();

    // Convert the difference from milliseconds to days
    return Math.round(differenceInMs / (1000 * 60 * 60 * 24));
  }
}
