import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, first, of, switchMap} from 'rxjs';
import * as R from 'ramda';
import {User} from '../models/user.model';
import {arrayToHashMap} from '../utils/arrayToHashMap.fnc';
import {ApiService} from './api.service';
import {Vote, VoteResult} from '../models/vote.model';
import {HotToastService} from '@ngneat/hot-toast';
import {TranslocoService} from '@ngneat/transloco';
import {Fixture} from '../models/fixture.model';
import {League} from '../models/league.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  prevMatches$ = new BehaviorSubject<Fixture[] | undefined>(undefined);
  votesOfPrevMatches$ = new BehaviorSubject<Record<string, Vote> | undefined>(undefined);
  nextMatches$ = new BehaviorSubject<Fixture[] | undefined>(undefined);
  votesOfNextMatches$ = new BehaviorSubject<Record<string, Vote> | undefined>(undefined);
  standings$ = new BehaviorSubject<User[] | undefined>(undefined);
  leagues$ = new BehaviorSubject<League[] | undefined>(undefined);
  lastCalculationDate$ = new BehaviorSubject<Date | undefined>(undefined);
  private apiService = inject(ApiService);
  private toastService = inject(HotToastService);
  private translocoService = inject(TranslocoService);

  clearAllMatchesVotes = () => {
    this.votesOfPrevMatches$.next({});
    this.votesOfNextMatches$.next({});
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
        },
        error: () => {
          this.votesOfPrevMatches$.next({});
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
          this.prevMatches$.next(
            R.sortWith<Fixture>([
              R.descend(R.prop('date')),
              R.ascend(R.prop('round')),
            ], fixtures)
          );
          resolve();
        },
        error: () => {
          this.prevMatches$.next([]);
        }
      })
  })

  loadNextMatches = (): Promise<void> => new Promise((resolve) => {
    this.apiService.getNextFixtures()
      .subscribe({
        next: (fixtures) => {
          const now = new Date();
          this.nextMatches$.next(
            R.sortWith<Fixture>([
              R.descend((fixture) => fixture.date < now ? -1 : 1),
              R.ascend(R.prop('date')),
              R.ascend(R.prop('round')),
            ], fixtures)
          );
          resolve();
        },
        error: () => {
          this.nextMatches$.next([]);
        }
      })
  })

  loadStandings = () => {
    this.standings$.next(undefined);
    this.apiService.getStandings()
      .subscribe({
        next: (users) => {
          this.standings$.next(users);
        },
        error: () => {
          this.standings$.next([]);
        }
      })
  }

  addVote = (matchId: string, result: VoteResult): Promise<void> => new Promise((resolve) => {
    this.votesOfNextMatches$
      .pipe(
        first(),
        switchMap(
          (votes) => {
            this.votesOfNextMatches$.next({
              ...votes,
              [matchId]: {
                matchId,
                result,
              }
            });
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
    this.votesOfNextMatches$
      .pipe(
        first(),
        switchMap(
          (votes) => {
            this.votesOfNextMatches$.next(R.omit([matchId], votes));
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

  loadLastCalculationDate = () => {
    this.apiService.getLastCalculationDate()
      .subscribe({
        next: ({lastCalculationDate}) => {
          this.lastCalculationDate$.next(new Date(lastCalculationDate));
        }
      })
  }
}
