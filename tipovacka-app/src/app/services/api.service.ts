import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Team} from '../models/team.model';
import {MatchResult} from '../models/match.model';
import {map} from 'rxjs';
import * as R from 'ramda';
import {Vote} from '../models/vote.model';
import {User} from '../models/user.model';
import {League} from '../models/league.model';
import {
  NewUserLeague,
  UserInUserLeague,
  UserLeague
} from '../models/user-league.model';
import {Fixture} from '../models/fixture.model';

export type returnIdValue = { id: string };

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private publicUrl = 'https://us-central1-tipovacka-c63cb.cloudfunctions.net/public';
  private privateUrl = 'https://us-central1-tipovacka-c63cb.cloudfunctions.net/private';
  private token: string | null = null;

  private http = inject(HttpClient);


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

  addVote = (matchId: string, result: MatchResult) =>
    this.http.post<void>(
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

  deleteVote = (matchId: string) =>
    this.http.delete<void>(
      `${this.privateUrl}/vote/${matchId}`,
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

  getStandings = () =>
    this.http.get<User[]>(
      `${this.publicUrl}/standings`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

  addUserLeague = (newUserLeague: NewUserLeague) =>
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

  deleteUserLeague = (userLeagueId: string) =>
    this.http.delete<void>(
      `${this.privateUrl}/user-league/${userLeagueId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  leaveUserLeague = (userLeagueId: string) =>
    this.http.post<void>(
      `${this.privateUrl}/user-league/${userLeagueId}/leave`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  joinUserLeague = (userLeagueId: string) =>
    this.http.post<void>(
      `${this.privateUrl}/user-league/${userLeagueId}/join`,
      {},
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

  getUserLeague = (userLeagueId: string) =>
    this.http.get<UserLeague>(
      `${this.publicUrl}/user-league/${userLeagueId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  getUserLeagueUsers = (userLeagueId: string) =>
    this.http.get<UserInUserLeague[]>(
      `${this.privateUrl}/user-league/${userLeagueId}/users`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  deleteUserFromUserLeague = (userLeagueId: string, userUid: string) =>
    this.http.patch <void>(
      `${this.privateUrl}/user-league/${userLeagueId}/leave/${userUid}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      },
    )

  getNextFixtures = () =>
    this.http.get<Fixture[]>(
      `${this.publicUrl}/fixtures/next`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )
      .pipe(
        map(
          R.map(
            (fixture) => ({
              ...fixture,
              date: new Date(fixture.date),
            })
          )
        )
      )

  getPrevFixtures = () =>
    this.http.get<Fixture[]>(
      `${this.publicUrl}/fixtures/prev`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )
      .pipe(
        map(
          R.map(
            (fixture) => ({
              ...fixture,
              date: new Date(fixture.date),
            })
          )
        )
      )

  getLeagues = () =>
    this.http.get<League[]>(
      `${this.publicUrl}/leagues`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  getLastCalculationDate = () =>
    this.http.get<{ lastCalculationDate: string }>(
      `${this.publicUrl}/standings/calculationDate`,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )

  getSeasons = () =>
    this.http.get<number[]>(
      `${this.publicUrl}/seasons`,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )
}
