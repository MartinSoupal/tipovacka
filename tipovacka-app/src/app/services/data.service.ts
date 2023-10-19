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

  private url = 'https://us-central1-tipovacka-c63cb.cloudfunctions.net/api';

  constructor(
    private http: HttpClient
  ) {
  }

  getTeams = () =>
    this.http.get<Team[]>(
      `${this.url}/teams`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

  getMatches = () =>
    this.http.get<Match[]>(
      `${this.url}/matches`,
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
      `${this.url}/match`,
      newMatch,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
}
