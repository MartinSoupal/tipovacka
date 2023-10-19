import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Team} from '../models/team.model';
import {Match, NewMatch} from '../models/match.model';
import {map} from 'rxjs';
import * as R from 'ramda';

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

  getMatches = () =>
    this.http.get<Match[]>(
      `${this.publicUrl}/matches`,
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
}
