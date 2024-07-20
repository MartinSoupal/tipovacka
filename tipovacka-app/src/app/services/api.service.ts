import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatchResult} from '../models/match.model';
import {map} from 'rxjs';
import {Vote} from '../models/vote.model';
import {User} from '../models/user.model';
import {League} from '../models/league.model';
import {Fixture} from '../models/fixture.model';

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

  getFixturesForLeague = (leagueId: string) =>
    this.http.get<{ prev: Fixture[], next: Fixture[] }>(
      `${this.publicUrl}/fixtures/${leagueId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
      }
    )
      .pipe(
        map(
          ({prev, next}) => ({
            prev: prev.map(
              (fixture) => ({
                ...fixture,
                date: new Date(fixture.date),
              })
            ),
            next: next.map(
              (fixture) => ({
                ...fixture,
                date: new Date(fixture.date),
              })
            )
          })
        )
      )
}
