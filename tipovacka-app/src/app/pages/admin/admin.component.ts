import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Team} from '../../models/team.model';
import {FormControl, FormGroup} from '@angular/forms';
import {League, Match, MatchResult, NewMatch, Stage} from '../../models/match.model';
import {combineLatest} from 'rxjs';
import {arrayToHashMap} from '../../utils/arrayToHashMap.fnc';
import * as R from 'ramda';

type NewMatchFormGroupModel = {
  stage: FormControl<Stage>;
  round: FormControl<string>;
  datetime: FormControl<Date>;
  home: FormControl<string>;
  away: FormControl<string>;
  league: FormControl<string>;
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
    stage: new FormControl<Stage>('Základní část'),
    round: new FormControl<string>(''),
    datetime: new FormControl<Date>(new Date()),
    home: new FormControl<string>(''),
    away: new FormControl<string>(''),
    league: new FormControl<string>('FL'),
  })
  matches: Match[] = [];
  leagues: League[] = ['FL', 'EURO24'];
  stages: Stage[] = ['Základní část', 'Nadstavba', 'Skupinová fáze', 'Vyřazovací fáze'];
  rounds: Record<Stage, string[]> = {
    'Základní část': [
      "1. kolo",
      "2. kolo",
      "3. kolo",
      "4. kolo",
      "5. kolo",
      "6. kolo",
      "7. kolo",
      "8. kolo",
      "9. kolo",
      "10. kolo",
      "11. kolo",
      "12. kolo",
      "13. kolo",
      "14. kolo",
      "15. kolo",
      "16. kolo",
      "17. kolo",
      "18. kolo",
      "19. kolo",
      "20. kolo",
      "21. kolo",
      "22. kolo",
      "23. kolo",
      "24. kolo",
      "25. kolo",
      "26. kolo",
      "27. kolo",
      "28. kolo",
      "29. kolo",
      "30. kolo"
    ],
    Nadstavba: [
      "1. kolo",
      "2. kolo",
      "3. kolo",
      "4. kolo",
      "5. kolo",
      "6. kolo",
    ],
    'Skupinová fáze': [
      "1. kolo",
      "2. kolo",
      "3. kolo",
      "4. kolo",
      "5. kolo",
      "6. kolo",
    ],
    'Vyřazovací fáze': [
      'Osmifinále',
      'Čtvrtfinále',
      'Semifinále',
      'Finále'
    ]
  }

  constructor(
    private dataService: DataService
  ) {
    combineLatest([
      this.dataService.getTeams(),
      this.dataService.getAllMatches(),
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
  }

  addMatch = () => {
    const match: NewMatch = this.newMatchFormGroup.value as NewMatch;
    match.datetime = new Date(`${match.datetime}+01:00`);
    this.dataService.addMatch(match)
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
            totalVotes: 0
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

  selectResult = (match: Match, event: Event) => {
    const result = Number((event.target as HTMLSelectElement).value) as MatchResult;
    this.dataService.editMatchResult(match.id, result)
      .subscribe({
        next: () => {
          match.result = result;
        }
      })
  }
}
