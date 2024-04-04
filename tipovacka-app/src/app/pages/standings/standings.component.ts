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
  seasons: number[] = [];
  activeLeague = 0;
  leagues$ = this.dataService.leagues$
    .pipe(
      map(
        (leagues) => {
          return [{id: 'all', name: 'TOTAL'}, ...(leagues ?? [])] as League[];
        }
      )
    )

  ngOnInit() {
    addEventListener('swipeRight', () => {
      if (!this.activeLeague) {
        return;
      }
      this.activeLeague--;
      document.getElementById(`league-badge-${this.activeLeague}`)!.scrollIntoView({inline: 'center'})
    })
    addEventListener('swipeLeft', () => {
      this.dataService.leagues$.pipe(first()).subscribe({
        next: (leagues) => {
          if ((leagues?.length || 0) > (this.activeLeague)) {
            this.activeLeague++;
            document.getElementById(`league-badge-${this.activeLeague}`)!.scrollIntoView({inline: 'center'})
          }
        }
      })
    })
  }
}
