import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, first, of, switchMap} from 'rxjs';
import * as R from 'ramda';
import {User} from '../models/user.model';
import {UserLeague} from '../models/user-league.model';
import {arrayToHashMap} from '../utils/arrayToHashMap.fnc';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {Vote, VoteResult} from '../models/vote.model';
import {HotToastService} from '@ngneat/hot-toast';
import {TranslocoService} from '@ngneat/transloco';
import {ActivatedRoute, Router} from '@angular/router';
import {Fixture} from '../models/fixture.model';
import {League} from '../models/league.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  prevMatches$ = new BehaviorSubject<Fixture[] | undefined>(undefined);
  leaguesOfPrevMatches$ = new BehaviorSubject<string[]>([]);
  votesOfPrevMatches$ = new BehaviorSubject<Record<string, Vote | undefined>>({});
  nextMatches$ = new BehaviorSubject<Fixture[] | undefined>(undefined);
  leaguesOfNextMatches$ = new BehaviorSubject<string[]>([]);
  votesOfNextMatches$ = new BehaviorSubject<Record<string, Vote> | undefined>(undefined);
  standings$ = new BehaviorSubject<User[] | undefined>(undefined);
  userLeagues$ = new BehaviorSubject<UserLeague[] | undefined>(undefined);
  selectedUserLeague$ = new BehaviorSubject<UserLeague | undefined>(undefined);
  leagues$ = new BehaviorSubject<League[] | undefined>(undefined);
  selectedLeagues$ = new BehaviorSubject<string[] | undefined>(undefined);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
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
        },
        error: () => {
          this.votesOfNextMatches$.next({});
        }
      });
  }

  loadPrevMatches = (): Promise<void> => new Promise((resolve) => {
    this.apiService.getPrevFixtures()
      .subscribe({
        next: (fixtures) => {
          const leaguesOfPrevMatches: string[] = R.uniq(
            R.map(
              (fixture) => fixture.leagueName,
              fixtures,
            )
          );
          this.leaguesOfPrevMatches$.next(leaguesOfPrevMatches);
          this.prevMatches$.next(
            R.sortWith<Fixture>([
              R.descend(R.prop('date')),
              R.ascend(R.prop('round')),
            ], fixtures)
          );
          resolve();
        }
      })
  })

  loadNextMatches = (): Promise<void> => new Promise((resolve) => {
    this.apiService.getNextFixtures()
      .subscribe({
        next: (fixtures) => {
          const now = new Date();
          const leaguesOfNextMatches: string[] = R.uniq(
            R.map(
              (fixture) => fixture.leagueName,
              fixtures,
            )
          );
          this.leaguesOfNextMatches$.next(leaguesOfNextMatches);
          this.nextMatches$.next(
            R.sortWith<Fixture>([
              R.descend((fixture) => fixture.date < now ? -1 : 1),
              R.ascend(R.prop('date')),
              R.ascend(R.prop('round')),
            ], fixtures)
          );
          resolve();
        }
      })
  })

  loadStandings = () => {
    this.standings$.next(undefined);
    this.apiService.getStandings()
      .subscribe({
        next: (users) => {
          this.standings$.next(users);
        }
      })
  }

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
            /*
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
             */
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
            /*
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
             */
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
                ul: newSelectedUserLeague?.id,
              },
              queryParamsHandling: 'merge',
            });
            this.selectedUserLeague$.next(newSelectedUserLeague);
            this.loadStandings();
          }
        }
      })
  }

  loadLeagues = (): Promise<void> => new Promise((resolve, reject) => {
    this.apiService.getLeagues()
      .subscribe({
        next: (leagues) => {
          this.leagues$.next(leagues);
          resolve();
        },
        error: () => {
          reject();
        }
      })
  })

  setSelectedLeagues = (selectedLeagues?: string[] | undefined) => {
    this.selectedLeagues$.next(selectedLeagues);
    localStorage.setItem('selectedLeagues', JSON.stringify(selectedLeagues));
  }
}
