import {
  AfterContentChecked,
  Component,
  inject,
  Input,
  OnInit
} from '@angular/core';
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
import {ActivatedRoute, Router} from '@angular/router';

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
export class FixturesComponent implements OnInit, AfterContentChecked {
  dataService = inject(DataService);
  authService = inject(AuthService);
  @Input({required: true}) fixtures?: Fixture[];
  @Input({required: true}) votes?: Record<string, Vote | undefined>;
  activeLeague = 0;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    addEventListener('swipeRight', () => {
      if (!this.activeLeague) {
        return;
      }
      this.setActiveLeague(this.activeLeague - 1);
    })
    addEventListener('swipeLeft', () => {
      this.dataService.leagues$.pipe(first()).subscribe({
        next: (leagues) => {
          if ((leagues?.length || 0) > (this.activeLeague + 1)) {
            this.setActiveLeague(this.activeLeague + 1);
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
                  this.activeLeague = leagues.findIndex(
                    (league) => league.name === params.get('league')
                  );
                  document.getElementById(`league-badge-${this.activeLeague}`)?.scrollIntoView({inline: 'center'});
                }
              })
          }
        }
      })
  }

  ngAfterContentChecked() {
    document.getElementById(`league-badge-${this.activeLeague}`)?.scrollIntoView({inline: 'center'});
  }

  setActiveLeague = (id: number) => {
    this.activeLeague = id;
    document.getElementById(`league-badge-${this.activeLeague}`)!.scrollIntoView({inline: 'center'});
    this.dataService.leagues$
      .pipe(
        first()
      )
      .subscribe({
        next: (leagues) => {
          if (!leagues?.length) {
            return;
          }
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: {league: leagues[id].name},
              queryParamsHandling: 'merge'
            }
          );
        }
      })
  }
}
