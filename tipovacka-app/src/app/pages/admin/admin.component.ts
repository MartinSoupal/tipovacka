import {Component, inject, OnInit} from '@angular/core';
import {Team} from '../../models/team.model';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Match, MatchResult, NewMatch} from '../../models/match.model';
import {combineLatest} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';
import {League, LeagueStage} from '../../models/league.model';
import {ApiService} from '../../services/api.service';
import {NgForOf} from '@angular/common';
import {AdminDatetimeFormatPipe} from '../../pipes/admin-datetime-format.pipe';

type NewMatchFormGroupModel = {
  stage: FormControl<LeagueStage | undefined>;
  round: FormControl<string>;
  datetime: FormControl<Date>;
  home: FormControl<string>;
  away: FormControl<string>;
  league: FormControl<League | undefined>;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AdminDatetimeFormatPipe
  ]
})
export class AdminComponent implements OnInit {
  teams: Team[] = [];
  teamsInHashMap: Record<string, Team> = {};
  newMatchFormGroup: FormGroup<NewMatchFormGroupModel> = new FormGroup<NewMatchFormGroupModel>(<NewMatchFormGroupModel>{
    stage: new FormControl<LeagueStage | undefined>(undefined),
    round: new FormControl<string>(''),
    datetime: new FormControl<Date>(new Date()),
    home: new FormControl<string>(''),
    away: new FormControl<string>(''),
    league: new FormControl<League | undefined>(undefined),
  })
  matches: Match[] = [];
  leagues: League[] = [];
  stages: LeagueStage[] = [];
  rounds: string[] = [];
  private apiService = inject(ApiService);

  ngOnInit() {
    combineLatest([
      this.apiService.getTeams(),
      this.apiService.getAllMatches(),
    ])
      .subscribe({
        next: ([teams, matches]) => {
          this.teams = teams;
          this.teamsInHashMap = arrayToHashMap('id', teams);
          this.matches = R.sort(
            (a, b) => a.datetime.getTime() - b.datetime.getTime(),
            matches.map(
              (match): Match => ({
                ...match,
                home: this.teamsInHashMap[match.home].name,
                away: this.teamsInHashMap[match.away].name,
              })
            )
          )
        }
      })
    this.newMatchFormGroup.get('stage')?.valueChanges
      .subscribe({
        next: () => {
          this.newMatchFormGroup.get('round')?.setValue('');
        }
      })
    this.apiService.getAllLeagues()
      .subscribe({
        next: league => {
          this.leagues = league;
        }
      })
    this.newMatchFormGroup.get('league')?.valueChanges
      .subscribe({
        next: league => {
          if (!league) {
            this.stages = [];
            return;
          }
          this.stages = league.stages;
        }
      })
    this.newMatchFormGroup.get('stage')?.valueChanges
      .subscribe({
        next: stage => {
          if (!stage) {
            this.rounds = [];
            return;
          }
          this.rounds = stage.rounds;
        }
      })
  }

  addMatch = () => {
    const match: NewMatch = {
      home: this.newMatchFormGroup.value.home || '',
      away: this.newMatchFormGroup.value.away || '',
      datetime: new Date(`${this.newMatchFormGroup.value.datetime}+01:00`) || new Date(),
      league: this.newMatchFormGroup.value.league?.name || '',
      stage: this.newMatchFormGroup.value.stage?.name || '',
      round: this.newMatchFormGroup.value.round || '',
    }
    this.apiService.addMatch(match)
      .subscribe({
        next: (id) => {
          this.matches.push({
            id,
            stage: match.stage,
            round: match.round,
            datetime: match.datetime,
            home: this.teamsInHashMap[match.home].name,
            away: this.teamsInHashMap[match.away].name,
            result: null,
            league: match.league,
            0: 0,
            1: 0,
            2: 0,
            totalVotes: 0,
            postponed: false,
          })
          this.newMatchFormGroup.get('home')?.reset();
          this.newMatchFormGroup.get('away')?.reset();
        }
      })
  }

  deleteMatch = (id: string) => {
    this.apiService.deleteMatch(id)
      .subscribe({
        next: () => {
          this.matches = R.reject<Match>(
            R.propEq(id, 'id')
          )(this.matches)
        }
      })
  }

  selectResult = (match: Match, event: Event) => {
    const result = Number((event.target as HTMLSelectElement).value) as MatchResult;
    this.apiService.editMatch(match.id, {result})
      .subscribe({
        next: () => {
          match.result = result;
        }
      })
  }

  setPostponed = (match: Match, event: Event) => {
    const postponed = (event.target as HTMLSelectElement).value === 'true'
    this.apiService.editMatch(match.id, {postponed})
      .subscribe({
        next: () => {
          match.postponed = postponed;
        }
      })
  }

  setDatetime = (match: Match, event: Event) => {
    const datetime = new Date(`${(event.target as HTMLInputElement).value}+01:00`)
    this.apiService.editMatch(match.id, {datetime})
      .subscribe({
        next: () => {
          match.datetime = datetime;
        }
      })
  }
}
