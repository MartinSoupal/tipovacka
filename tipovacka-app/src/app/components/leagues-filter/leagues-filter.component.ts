import {Component, inject, OnInit} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';
import {AsyncPipe, NgForOf} from '@angular/common';
import {DataService} from '../../services/data.service';
import {HotToastService} from '@ngneat/hot-toast';
import {SortByPipe} from '../../pipes/sort-by.pipe';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {combineLatest, first} from 'rxjs';
import * as R from 'ramda';
import {League} from '../../models/league.model';

@Component({
  selector: 'app-user-leagues-overview',
  standalone: true,
  imports: [
    TranslocoPipe,
    NgForOf,
    AsyncPipe,
    SortByPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './leagues-filter.component.html',
  styleUrl: './leagues-filter.component.scss'
})
export class LeaguesFilterComponent implements OnInit {
  ref: DialogRef<void, undefined> = inject(DialogRef);
  dataService = inject(DataService);
  formGroup = new FormGroup({});
  private toastService = inject(HotToastService);

  ngOnInit() {
    combineLatest([
      this.dataService.selectedLeagues$,
      this.dataService.leagues$,
    ])
      .pipe(first())
      .subscribe({
        next: ([selectedLeagues, leagues]) => {
          if (!leagues) {
            return;
          }
          R.forEach(
            (league: League) => {
              this.formGroup.addControl(league.name, new FormControl<boolean>(selectedLeagues ? selectedLeagues.indexOf(league.name) !== -1 : false))
            },
            leagues
          );
        }
      });

    this.ref.afterClosed$
      .pipe(first())
      .subscribe({
        next: () => {
          const values: Record<string, boolean> = this.formGroup.value;
          this.dataService.setSelectedLeagues(Object.keys(values).filter(key => values[key]))
        }
      })
  }
}
