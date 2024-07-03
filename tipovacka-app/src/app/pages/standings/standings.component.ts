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
import {first, map} from 'rxjs';
import {DateFormatPipe} from '../../pipes/date-format.pipe';
import {SwipeGestureDirective} from '../../directives/swipeGesture.directive';
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
    SwipeGestureDirective,
    SortAndFilterStandingPipe
  ],
})
export class StandingsComponent implements OnInit {
  loadingArray = [0, 1, 2, 3, 4];
  dataService = inject(DataService);
  authService = inject(AuthService);

  activeLeagueIndex = 0;
  activeLeague!: League;

  private readonly totalLeague: League = {id: 'all', name: 'TOTAL', color: ''};

  leagues$ = this.dataService.leagues$
    .pipe(
      map(
        (leagues) => {
          return [this.totalLeague, ...(leagues ?? [])] as League[];
        }
      )
    )
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    addEventListener('swipeRight', () => {
      if (!this.activeLeagueIndex) {
        return;
      }
      this.setActiveLeague(this.activeLeagueIndex - 1);
    })
    addEventListener('swipeLeft', () => {
      this.dataService.leagues$.pipe(first()).subscribe({
        next: (leagues) => {
          if ((leagues?.length || 0) > (this.activeLeagueIndex + 1)) {
            this.setActiveLeague(this.activeLeagueIndex + 1);
          }
        }
      })
    })
    this.route.queryParamMap
      .subscribe({
        next: (params) => {
          if (params.has('league')) {
            this.dataService.leagues$
              .pipe(first())
              .subscribe({
                next: (leagues) => {
                  if (!leagues?.length) {
                    return;
                  }
                  this.setActiveLeague(leagues.findIndex(
                    (league) => league.name === params.get('league')
                  ) + 1);
                }
              })
          }
        }
      })
  }

  setActiveLeague = (id: number) => {
    this.activeLeagueIndex = id;
    document.getElementById(`league-badge-${this.activeLeagueIndex}`)?.scrollIntoView({inline: 'center'});

    if (this.activeLeagueIndex === 0) {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {league: null},
          queryParamsHandling: 'merge'
        }
      );
      this.activeLeague = this.totalLeague;
      return;
    }

    this.dataService.leagues$
      .pipe(
        first()
      )
      .subscribe({
        next: (leagues) => {
          if (!leagues?.length) {
            return;
          }
          this.activeLeague = leagues[id - 1];
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: {league: this.activeLeague.name},
              queryParamsHandling: 'merge'
            }
          );
        }
      })
  }
}
