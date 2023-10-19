import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Team} from '../../models/team.model';
import {FormControl, FormGroup} from '@angular/forms';
import {NewMatch} from '../../models/match.model';

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
  newMatchFormGroup: FormGroup<NewMatchFormGroupModel> = new FormGroup<NewMatchFormGroupModel>(<NewMatchFormGroupModel>{
    round: new FormControl<number>(0),
    datetime: new FormControl<Date>(new Date()),
    home: new FormControl<string>(''),
    away: new FormControl<string>(''),
  })

  constructor(
    private dataService: DataService
  ) {
    this.dataService.getTeams()
      .subscribe({
        next: teams => {
          this.teams = teams;
        }
      })
  }

  addMatch = () => {
    this.dataService.addMatch(this.newMatchFormGroup.value as NewMatch)
      .subscribe({
        next: () => {
          this.newMatchFormGroup.get('home')?.reset();
          this.newMatchFormGroup.get('away')?.reset();
        }
      })
  }
}
