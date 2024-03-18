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
  formGroup = new FormGroup({
    leagues: new FormGroup({}),
    seasons: new FormGroup({}),
  });
  private toastService = inject(HotToastService);

  ngOnInit() {
    combineLatest([
      this.dataService.selectedLeagues$,
      this.dataService.selectedSeasons$,
      this.dataService.leagues$,
      this.dataService.seasons$,
    ])
      .pipe(first())
      .subscribe({
        next: ([selectedLeagues, selectedSeasons, leagues, seasons]) => {
          if (seasons) {
            R.forEach(
              (season: number) => {
                (this.formGroup.get('seasons') as FormGroup).addControl(season.toString(), new FormControl<boolean>(selectedSeasons ? selectedSeasons.indexOf(season) !== -1 : false))
              },
              seasons
            );
          }
          if (!leagues) {
            return;
          }
          R.forEach(
            (league: League) => {
              (this.formGroup.get('leagues') as FormGroup).addControl(league.name, new FormControl<boolean>(selectedLeagues ? selectedLeagues.indexOf(league.name) !== -1 : false))
            },
            leagues
          );
        }
      });

    this.ref.afterClosed$
      .pipe(first())
      .subscribe({
        next: () => {
          const leagues = this.formGroup.value.leagues as Record<string, boolean>;
          this.dataService.setSelectedLeagues(Object.keys(leagues).filter(key => leagues[key]));
          const seasons = this.formGroup.value.seasons as Record<string, boolean>;
          this.dataService.setSelectedSeasons(Object.keys(seasons).filter(key => seasons[key]).map((season) => Number(season)));
        }
      })
  }
}
