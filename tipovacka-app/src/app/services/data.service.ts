import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Team} from '../models/team.model';
import {EditedMatch, Match, MatchResult, NewMatch} from '../models/match.model';
import {map} from 'rxjs';
import * as R from 'ramda';
import {Vote} from '../models/vote.model';
import {User} from '../models/user.model';
import {League} from '../models/league.model';
import {NewUserLeague, UserLeague} from '../models/user-league.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private publicUrl = 'https://us-central1-tipovacka-c63cb.cloudfunctions.net/public';
  private privateUrl = 'https://us-central1-tipovacka-c63cb.cloudfunctions.net/private';
  private token: string | null = null;

  constructor(
    private http: HttpClient,
  ) {
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
    this.http.post<string>(
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

  addUserLeague = (newUserLeague: NewUserLeague) =>
    this.http.post<string>(
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
}
