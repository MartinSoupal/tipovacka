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
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {Vote, VoteResult} from '../models/vote.model';
import {HotToastService} from '@ngneat/hot-toast';
import {TranslocoService} from '@ngneat/transloco';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  prevMatches$ = new BehaviorSubject<MatchWithTeamName[] | undefined>(undefined);
  leaguesOfPrevMatches$ = new BehaviorSubject<string[]>([]);
  votesOfPrevMatches$ = new BehaviorSubject<Record<string, Vote | undefined>>({});
  nextMatches$ = new BehaviorSubject<MatchWithTeamName[] | undefined>(undefined);
  leaguesOfNextMatches$ = new BehaviorSubject<string[]>([]);
  votesOfNextMatches$ = new BehaviorSubject<Record<string, Vote> | undefined>(undefined);
  standings$ = new BehaviorSubject<User[] | undefined>(undefined);
  userLeagues$ = new BehaviorSubject<UserLeague[] | undefined>(undefined);
  selectedUserLeague$ = new BehaviorSubject<UserLeague | undefined>(undefined);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamsInHashMap?: Record<string, Team>;
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private toastService = inject(HotToastService);
  private translocoService = inject(TranslocoService);

  clearAllMatchesVotes = () => {
    this.votesOfPrevMatches$.next({});
    this.votesOfNextMatches$.next({});
  }

  clearUserLeagues = () => {
    this.userLeagues$.next(undefined);
    this.selectedUserLeague$.next(undefined);
  }

  loadPrevMatchesVotes = () => {
    this.prevMatches$
      .pipe(
        first(),
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
        first(),
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

  loadPrevMatches = (): Promise<void> => new Promise((resolve) => {
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
            R.filter(
              (match) => match.result !== null,
              matches
            )
              .map(
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
          resolve();
        }
      })
  })

  loadNextMatches = (): Promise<void> => new Promise((resolve) => {
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
          resolve();
        }
      })
  })

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

  addUserLeague = (newUserLeague: NewUserLeague): void => {
    combineLatest([
      this.apiService.addUserLeague(newUserLeague),
      this.userLeagues$,
    ])
      .pipe(
        first(),
        this.toastService.observe({
          loading: this.translocoService.translate('USER_LEAGUE_CREATING'),
          success: this.translocoService.translate('USER_LEAGUE_CREATED'),
          error: this.translocoService.translate('USER_LEAGUE_COULD_NOT_CREATE'),
        }),
        map(
          ([{id}, userLeagues]) => {
            this.userLeagues$.next([
              ...(userLeagues || []),
              {
                id,
                isAdmin: true,
                isUser: true,
                ...newUserLeague,
              }
            ]);
            return {id};
          }
        )
      )
      .subscribe()
  }

  deleteUserLeague = (userLeagueId: string): void => {
    combineLatest([
      this.userLeagues$,
      this.selectedUserLeague$
    ])
      .pipe(
        first(),
        switchMap(
          ([userLeagues, selectedUserLeague]) => {
            const userLeagueIndex = R.findIndex(R.propEq(userLeagueId, 'id'), userLeagues!);
            this.userLeagues$.next(R.remove(userLeagueIndex, 1, userLeagues!));
            if (selectedUserLeague?.id === userLeagueId) {
              this.selectedUserLeague$.next(undefined);
            }
            if (selectedUserLeague?.id === userLeagueId) {
              this.loadStandings()
            }
            return this.apiService.deleteUserLeague(userLeagueId)
              .pipe(
                this.toastService.observe({
                  loading: this.translocoService.translate('USER_LEAGUE_DELETING'),
                  success: this.translocoService.translate('USER_LEAGUE_DELETED'),
                  error: this.translocoService.translate('USER_LEAGUE_COULD_NOT_DELETE'),
                })
              );
          }
        )
      )
      .subscribe()
  }

  leaveUserLeague = (userLeagueId: string): void => {
    combineLatest([
      this.userLeagues$,
      this.selectedUserLeague$
    ])
      .pipe(
        first(),
        switchMap(
          ([userLeagues, selectedUserLeague,]) => {
            const userLeagueIndex = R.findIndex(R.propEq(userLeagueId, 'id'), userLeagues!);
            if (!userLeagues![userLeagueIndex].isAdmin) {
              this.userLeagues$.next(R.remove(userLeagueIndex, 1, userLeagues!));
              if (selectedUserLeague?.id === userLeagueId) {
                this.selectedUserLeague$.next(undefined);
              }
            }
            if (userLeagues![userLeagueIndex].isAdmin) {
              userLeagues![userLeagueIndex].isUser = false;
              this.userLeagues$.next(userLeagues);
            }
            if (userLeagues![userLeagueIndex].isAdmin && selectedUserLeague?.id === userLeagueId) {
              this.loadStandings()
            }
            return this.apiService.leaveUserLeague(userLeagueId)
              .pipe(
                this.toastService.observe({
                  loading: this.translocoService.translate('USER_LEAGUE_LEAVING'),
                  success: this.translocoService.translate('USER_LEAGUE_LEAVED'),
                  error: this.translocoService.translate('USER_LEAGUE_COULD_NOT_LEAVE'),
                }),
              );
          }
        )
      )
      .subscribe()
  }

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

  addVote = (matchId: string, result: VoteResult): Promise<void> => new Promise((resolve) => {
    combineLatest([
      this.votesOfNextMatches$,
      this.nextMatches$,
    ])
      .pipe(
        first(),
        switchMap(
          ([votes, matches]) => {
            const previousVote: Vote | undefined = votes && votes[matchId];
            this.votesOfNextMatches$.next({
              ...votes,
              [matchId]: {
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
            );
            return this.apiService.addVote(matchId, result)
              .pipe(
                this.toastService.observe({
                  loading: this.translocoService.translate('VOTE_SAVING'),
                  success: this.translocoService.translate('VOTE_SAVED'),
                  error: this.translocoService.translate('VOTE_COULD_NOT_SAVE'),
                })
              );
          }
        )
      )
      .subscribe({
        next: () => {
          resolve();
        }
      })
  })

  deleteVote = (matchId: string): Promise<void> => new Promise((resolve) => {
    combineLatest([
      this.votesOfNextMatches$,
      this.nextMatches$,
    ])
      .pipe(
        first(),
        switchMap(
          ([votes, matches]) => {
            const previousVote: Vote | undefined = votes && votes[matchId];
            this.votesOfNextMatches$.next(R.omit([matchId], votes));
            this.nextMatches$.next(
              R.map(
                (match) => {
                  if (match.id === matchId) {
                    match[previousVote!.result]--;
                    match.totalVotes--;
                  }
                  return match;
                },
                matches!,
              )
            )
            return this.apiService.deleteVote(matchId)
              .pipe(
                this.toastService.observe({
                  loading: this.translocoService.translate('VOTE_REMOVING'),
                  success: this.translocoService.translate('VOTE_REMOVED'),
                  error: this.translocoService.translate('VOTE_COULD_NOT_REMOVED'),
                })
              )
          }
        )
      )
      .subscribe({
        next: () => {
          resolve();
        }
      })
  })

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
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {
                ul: newSelectedUserLeague!.id,
              },
              queryParamsHandling: 'merge',
            });
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
