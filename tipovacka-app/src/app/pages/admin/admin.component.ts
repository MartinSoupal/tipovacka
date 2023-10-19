import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Team} from '../../models/team.model';
import {FormControl, FormGroup} from '@angular/forms';
import {Match, NewMatch} from '../../models/match.model';
import {combineLatest} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';

type NewMatchFormGroupModel = {
  round: FormControl<number>;
  datetime: FormControl<Date>;
  home: FormControl<string>;
  away: FormControl<string>;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  teams: Team[] = [];
  teamsInHashMap: Record<string, Team> = {};
  newMatchFormGroup: FormGroup<NewMatchFormGroupModel> = new FormGroup<NewMatchFormGroupModel>(<NewMatchFormGroupModel>{
    round: new FormControl<number>(0),
    datetime: new FormControl<Date>(new Date()),
    home: new FormControl<string>(''),
    away: new FormControl<string>(''),
  })
  matches: Match[] = [];

  constructor(
    private dataService: DataService
  ) {
    combineLatest([
      this.dataService.getTeams(),
      this.dataService.getMatches(),
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
  }

  addMatch = () => {
    const match: NewMatch = this.newMatchFormGroup.value as NewMatch;
    this.dataService.addMatch(match)
      .subscribe({
        next: (id) => {
          match.datetime = new Date(match.datetime);
          match.datetime.setHours(match.datetime.getHours() - 2);
          this.matches.push({
            id,
            round: match.round,
            datetime: match.datetime,
            home: this.teamsInHashMap[match.home].name,
            away: this.teamsInHashMap[match.away].name,
          })
          this.newMatchFormGroup.get('home')?.reset();
          this.newMatchFormGroup.get('away')?.reset();
        }
      })
  }

  deleteMatch = (id: string) => {
    this.dataService.deleteMatch(id)
      .subscribe({
        next: () => {
          this.matches = R.reject<Match>(
            R.propEq(id, 'id')
          )(this.matches)
        }
      })
  }
}
