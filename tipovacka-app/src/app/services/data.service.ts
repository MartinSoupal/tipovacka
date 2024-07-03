import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, first, of, switchMap} from 'rxjs';
import * as R from 'ramda';
import {User} from '../models/user.model';
import {arrayToHashMap} from '../utils/arrayToHashMap.fnc';
import {ApiService} from './api.service';
import {Vote, VoteResult} from '../models/vote.model';
import {HotToastService} from '@ngneat/hot-toast';
import {TranslocoService} from '@ngneat/transloco';
import {Fixture2} from '../models/fixture.model';
import {League} from '../models/league.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  standings$ = new BehaviorSubject<User[] | undefined>(undefined);
  leagues$ = new BehaviorSubject<League[] | undefined>(undefined);
  lastCalculationDate$ = new BehaviorSubject<Date | undefined>(undefined);
  prevLeaguesMatches$: Record<string, BehaviorSubject<Fixture2[]> | undefined> = {};
  nextLeaguesMatches$: Record<string, BehaviorSubject<Fixture2[]> | undefined> = {};
  prevLeaguesVotes$: Record<string, BehaviorSubject<Record<string, Vote>> | undefined> = {};
  nextLeaguesVotes$: Record<string, BehaviorSubject<Record<string, Vote>> | undefined> = {};
  private apiService = inject(ApiService);
  private toastService = inject(HotToastService);
  private translocoService = inject(TranslocoService);

  clearAllMatchesVotes = () => {
    this.nextLeaguesVotes$ = {};
    this.prevLeaguesVotes$ = {};
  }

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

  addVote = (matchId: string, result: VoteResult, leagueId: string): Promise<void> => new Promise((resolve) => {
    this.nextLeaguesVotes$[leagueId]!
      .pipe(
        first(),
        switchMap(
          (votes) => {
            this.nextLeaguesVotes$[leagueId]!.next({
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

  deleteVote = (matchId: string, leagueId: string): Promise<void> => new Promise((resolve) => {
    this.nextLeaguesVotes$[leagueId]!
      .pipe(
        first(),
        switchMap(
          (votes) => {
            this.nextLeaguesVotes$[leagueId]!.next(R.omit([matchId], votes));
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

  loadLeagues = (): Promise<League[]> => new Promise((resolve, reject) => {
    this.apiService.getLeagues()
      .subscribe({
        next: (leagues) => {
          this.leagues$.next(leagues);
          resolve(leagues);
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

  loadMatchesForLeague = (leagueId: string): Promise<void> => new Promise((resolve, reject) => {
    this.apiService.getFixturesForLeague(leagueId)
      .subscribe({
        next: (fixtures) => {
          if (!this.prevLeaguesMatches$[leagueId]) {
            this.prevLeaguesMatches$[leagueId] = new BehaviorSubject<Fixture2[]>(fixtures.prev);
          } else {
            this.prevLeaguesMatches$[leagueId]!.next(fixtures.prev);
          }
          if (!this.nextLeaguesMatches$[leagueId]) {
            this.nextLeaguesMatches$[leagueId] = new BehaviorSubject<Fixture2[]>(fixtures.next);
          } else {
            this.nextLeaguesMatches$[leagueId]!.next(fixtures.next);
          }
          resolve();
        },
        error: () => {
          reject()
        }
      })
  })

  loadFixturesVotesForLeague = (leagueId: string) => {
    this.nextLeaguesMatches$[leagueId]!
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
          if (!this.nextLeaguesVotes$[leagueId]) {
            this.nextLeaguesVotes$[leagueId] = new BehaviorSubject<Record<string, Vote>>(arrayToHashMap('matchId', votes));
          } else {
            this.nextLeaguesVotes$[leagueId]!.next(arrayToHashMap('matchId', votes));
          }
        }
      });
    this.prevLeaguesMatches$[leagueId]!
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
          if (!this.prevLeaguesVotes$[leagueId]) {
            this.prevLeaguesVotes$[leagueId] = new BehaviorSubject<Record<string, Vote>>(arrayToHashMap('matchId', votes));
          } else {
            this.prevLeaguesVotes$[leagueId]!.next(arrayToHashMap('matchId', votes));
          }
        }
      });
  }
}
