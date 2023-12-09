import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Team} from '../models/team.model';
import {
  EditedMatch,
  Match,
  MatchResult,
  MatchWithTeamName,
  NewMatch
} from '../models/match.model';
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
import {Vote} from '../models/vote.model';
import {User} from '../models/user.model';
import {League} from '../models/league.model';
import {NewUserLeague, UserLeague} from '../models/user-league.model';
import {arrayToHashMap} from '../utils/arrayToHashMap.fnc';

type returnIdValue = { id: string };

@Injectable({
  providedIn: 'root'
})
export class DataService {

  prevMatches$ = new BehaviorSubject<MatchWithTeamName[] | undefined>(undefined);
  leaguesOfPrevMatches$ = new BehaviorSubject<string[]>([]);
  nextMatches$ = new BehaviorSubject<MatchWithTeamName[] | undefined>(undefined);
  leaguesOfNextMatches$ = new BehaviorSubject<string[]>([]);
  standings$ = new BehaviorSubject<User[] | undefined>(undefined);
  userLeagues$ = new BehaviorSubject<UserLeague[] | undefined>(undefined);
  selectedUserLeagues$ = new BehaviorSubject<UserLeague | undefined>(undefined);
  private publicUrl = 'https://us-central1-tipovacka-c63cb.cloudfunctions.net/public';
  private privateUrl = 'https://us-central1-tipovacka-c63cb.cloudfunctions.net/private';
  private token: string | null = null;
  private teamsInHashMap?: Record<string, Team>;

  constructor(
    private http: HttpClient,
  ) {
  }

  loadPrevMatches = () => {
    combineLatest([
      this.loadAllTeams(),
      this.getPrevMatches(),
    ])
      .pipe(
        switchMap(
          ([teamsInHashMap, matches]) =>
            (this.token && matches.length ?
              this.getVotes(R.map(R.prop('id'), matches)) :
              of([]))
              .pipe(
                map((votes): [Record<string, Team>, Match[], Vote[]] => [teamsInHashMap, matches, votes])
              )
        )
      )
      .subscribe({
        next: ([teamsInHashMap, matches, votes]: [Record<string, Team>, Match[], Vote[]]) => {
          const votesInHashMap = arrayToHashMap('matchId', votes);
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
                  vote: R.defaultTo(null, votesInHashMap[match.id]?.result),
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
      this.getNextMatches(),
    ])
      .pipe(
        switchMap(
          ([teamsInHashMap, matches]) =>
            (this.token && matches.length ?
              this.getVotes(R.map(R.prop('id'), matches)) :
              of([]))
              .pipe(
                map((votes): [Record<string, Team>, Match[], Vote[]] => [teamsInHashMap, matches, votes])
              )
        )
      )
      .subscribe({
        next: ([teamsInHashMap, matches, votes]: [Record<string, Team>, Match[], Vote[]]) => {
          const votesInHashMap = arrayToHashMap('matchId', votes);
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
                  vote: R.defaultTo(null, votesInHashMap[match.id]?.result),
                }
              },
            ))
          this.leaguesOfNextMatches$.next(leaguesOfNextMatches);
          this.nextMatches$.next(nextMatches);
        }
      })
  }

  loadStandings = () => {
    this.selectedUserLeagues$
      .pipe(
        first()
      )
      .subscribe({
        next: (selectedUserLeague) => {
          (selectedUserLeague ? this.getStandingsForUserLeague(selectedUserLeague.id) : this.getStandings())
            .subscribe({
              next: (users) => {
                this.standings$.next(users);
              }
            })
        }
      })
  }

  loadUserLeagues = () => {
    if (this.token) {
      this.getAllUserLeagues()
        .subscribe({
          next: (userLeagues) => {
            this.userLeagues$.next(userLeagues);
          }
        })
    }
  }

  addUserLeague = (newUserLeague: NewUserLeague): Observable<string> =>
    combineLatest([
      this._addUserLeague(newUserLeague),
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
                ...newUserLeague,
              }
            ]);
            return id;
          }
        )
      )

  setSelectedUserLeague = (selectedUserLeague?: UserLeague) => {
    this.selectedUserLeagues$.next(selectedUserLeague);
    this.loadStandings();
  }


  setToken = (token: string | null) => {
    this.token = token;
  }

  getTeams = () =>
    this.http.get<Team[]>(
      `${this.publicUrl}/teams`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

  getPrevMatches = () =>
    this.http.get<Match[]>(
      `${this.publicUrl}/matches/prev`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .pipe(
        map(
          R.map(
            match => ({
              ...match,
              datetime: new Date(match.datetime),
              totalVotes: R.defaultTo(0, match[0]) + R.defaultTo(0, match[1]) + R.defaultTo(0, match[2]),
            })
          )
        )
      )

  getNextMatches = () =>
    this.http.get<Match[]>(
      `${this.publicUrl}/matches/next`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .pipe(
        map(
          R.map(
            match => ({
              ...match,
              datetime: new Date(match.datetime),
              totalVotes: R.defaultTo(0, match[0]) + R.defaultTo(0, match[1]) + R.defaultTo(0, match[2]),
            })
          )
        )
      )

  getAllMatches = () =>
    this.http.get<Match[]>(
      `${this.privateUrl}/match/all`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
      }
    )
      .pipe(
        map(
          R.map(
            match => ({
              ...match,
              datetime: new Date(match.datetime),
              totalVotes: R.defaultTo(0, match[0]) + R.defaultTo(0, match[1]) + R.defaultTo(0, match[2]),
            })
          )
        )
      )

  addMatch = (newMatch: NewMatch) =>
    this.http.post<string>(
      `${this.privateUrl}/match`,
      newMatch,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  deleteMatch = (matchId: string) =>
    this.http.delete<void>(
      `${this.privateUrl}/match/${matchId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  addVote = (matchId: string, result: MatchResult) =>
    this.http.post<returnIdValue>(
      `${this.privateUrl}/vote`,
      {
        matchId,
        result,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  getVotes = (matchIds: string[]) =>
    this.http.post<Vote[]>(
      `${this.privateUrl}/votes`,
      {
        matchIds
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
      }
    )

  editMatch = (matchId: string, editedMatch: Partial<EditedMatch>) =>
    this.http.patch<string>(
      `${this.privateUrl}/match/${matchId}`,
      editedMatch,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  getStandings = () =>
    this.http.get<User[]>(
      `${this.publicUrl}/standings`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .pipe(
        map(
          R.map(
            (user) => ({
              ...user,
              correctRatio: user.correctVotes / user.totalVotes,
            })
          )
        )
      )

  getStandingsForUserLeague = (userLeagueId: string) =>
    this.http.get<User[]>(
      `${this.publicUrl}/standings/${userLeagueId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .pipe(
        map(
          R.map(
            (user) => ({
              ...user,
              correctRatio: user.correctVotes / user.totalVotes,
            })
          )
        )
      )

  getAllLeagues = () =>
    this.http.get<League[]>(
      `${this.privateUrl}/leagues/all`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
      }
    )

  _addUserLeague = (newUserLeague: NewUserLeague) =>
    this.http.post<returnIdValue>(
      `${this.privateUrl}/user-league`,
      newUserLeague,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  getAllUserLeagues = () =>
    this.http.get<UserLeague[]>(
      `${this.privateUrl}/user-league/all`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  private loadAllTeams = () => new Promise<Record<string, Team>>((resolve) => {
    if (this.teamsInHashMap) {
      resolve(this.teamsInHashMap);
    } else {
      this.getTeams()
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
