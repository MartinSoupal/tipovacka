import {Component, inject, OnInit} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';
import {League} from '../../models/league.model';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {DataService} from '../../services/data.service';


function atLeastOneTrueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormGroup) {
      let hasTrue = Object.values(control.controls).some(c => c.value === true);
      return hasTrue ? null : {'atLeastOneTrue': true};
    }
    return null;
  };
}

@Component({
  selector: 'app-create-user-league',
  standalone: true,
  imports: [
    TranslocoPipe,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    JsonPipe
  ],
  templateUrl: './create-user-league.component.html',
  styleUrl: './create-user-league.component.scss'
})
export class CreateUserLeagueComponent implements OnInit {
  ref: DialogRef<void, undefined> = inject(DialogRef);
  leagues: League[] = [];
  formGroup = new FormGroup<any>({
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(20)]),
    startedDate: new FormControl<string>(''),
    leagues: new FormGroup({}, atLeastOneTrueValidator()),
  })
  private apiService = inject(ApiService);
  private dataService = inject(DataService);

  ngOnInit() {
    this.apiService.getAllLeagues()
      .subscribe({
        next: leagues => {
          this.leagues = leagues;
          leagues.forEach(
            (league) => {
              (this.formGroup.get('leagues') as FormGroup).addControl(league.name, new FormControl<boolean>(false));
            }
          )
        }
      })
  }

  submit = () => {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const name = this.formGroup.get('name')!.value;
      const startedDate = new Date(`${this.formGroup.get('startedDate')!.value}T00:00+01:00`);
      const leagues = Object.keys(this.formGroup.get('leagues')!.value).filter(key => this.formGroup.get('leagues')!.value[key] === true);
      this.ref.close();
      this.dataService.addUserLeague({
        name,
        startedDate,
        leagues,
      });
    }
  }
}
