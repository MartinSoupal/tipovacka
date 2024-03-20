import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';

import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';
import {FilterMatchesByPipe} from '../../pipes/filter-matches-by.pipe';

import {
  MatchSkeletonComponent
} from '../match-skeleton/match-skeleton.component';
import {MatchComponent} from '../match/match.component';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {Fixture} from '../../models/fixture.model';
import {Vote} from '../../models/vote.model';
import {first} from 'rxjs';
import {SwipeGestureDirective} from '../../directives/swipeGesture.directive';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    TranslocoPipe,
    MatchSkeletonComponent,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    FilterMatchesByPipe,
    MatchComponent,
    FilterMatchesByPipe,
    NgForOf,
    NgClass,
    SwipeGestureDirective
  ],
})
export class FixturesComponent implements OnInit {
  dataService = inject(DataService);
  authService = inject(AuthService);

  @Input({required: true}) fixtures?: Fixture[];
  @Input({required: true}) votes?: Record<string, Vote | undefined>;

  activeLeague = 0;

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
          if ((leagues?.length || 0) > (this.activeLeague + 1)) {
            this.activeLeague++;
            document.getElementById(`league-badge-${this.activeLeague}`)!.scrollIntoView({inline: 'center'})
          }
        }
      })
    })
  }
}
