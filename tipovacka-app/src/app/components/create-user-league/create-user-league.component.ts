import {Component, inject} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';
import {DataService} from '../../services/data.service';
import {League} from '../../models/league.model';
import {NgForOf, NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-user-league',
  standalone: true,
  imports: [
    TranslocoPipe,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-user-league.component.html',
  styleUrl: './create-user-league.component.scss'
})
export class CreateUserLeagueComponent {
  ref: DialogRef<void, boolean> = inject(DialogRef);
  leagues: League[] = [];
  formGroup = new FormGroup<any>({
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    startedDate: new FormControl<string>(''),
    leagues: new FormGroup({}),
  })

  constructor(
    private dataService: DataService
  ) {
    this.dataService.getAllLeagues()
      .subscribe({
        next: leagues => {
          this.leagues = leagues;
          leagues.forEach(
            (league) => {
              (this.formGroup.get('leagues') as FormGroup).addControl(league.id, new FormControl<boolean>(false));
            }
          )
        }
      })
  }

  submit = () => {
    console.log(this.formGroup.value);
    this.formGroup.markAsTouched();
    if (this.formGroup.valid) {
      this.dataService.addUserLeague({
        name: this.formGroup.get('name')!.value,
        startedDate: new Date(`${this.formGroup.get('startedDate')!.value}T00:00+01:00`),
        leagues: Object.keys(this.formGroup.get('leagues')!.value).filter(key => this.formGroup.get('leagues')!.value[key] === true)
      })
        .subscribe()
    }
  }
}
