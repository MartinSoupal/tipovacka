import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {SortByPipe} from '../../pipes/sort-by.pipe';
import {
  AsyncPipe,
  DecimalPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {first} from 'rxjs';
import {DateFormatPipe} from '../../pipes/date-format.pipe';
import {League} from '../../models/league.model';
import {
  SortAndFilterStandingPipe
} from '../../pipes/sort-and-filter-standing.pipe';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
  standalone: true,
  imports: [
    SortByPipe,
    AsyncPipe,
    NgForOf,
    TranslocoPipe,
    NgIf,
    NgClass,
    DecimalPipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DateFormatPipe,
    SortAndFilterStandingPipe
  ],
})
export class StandingsComponent implements OnInit {
  loadingArray = [0, 1, 2, 3, 4];
  dataService = inject(DataService);
  authService = inject(AuthService);
  activeLeague?: League;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParamMap
      .subscribe({
        next: (params) => {
          if (params.has('league')) {
            this.setActiveLeague(params.get('league')!);
          } else {
            this.setActiveLeague('');
          }
        }
      })
  }

  selectActiveLeague = (event: Event) => {
    const leagueId: string = (event.target as HTMLSelectElement).value;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {league: leagueId ?? null},
        queryParamsHandling: 'merge'
      }
    );
  }

  setActiveLeague = (id: string) => {
    this.dataService.leagues$
      .pipe(first())
      .subscribe({
        next: (leagues) => {
          if (!leagues?.length) {
            return;
          }
          this.activeLeague = leagues?.find(
            (league) => league.id == id,
          );
        }
      })
  }
}
