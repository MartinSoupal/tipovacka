import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';

import {
  MatchSkeletonComponent
} from '../match-skeleton/match-skeleton.component';
import {MatchComponent} from '../match/match.component';
import {AuthService} from '../../services/auth.service';
import {
  FixturesObservables,
  VotesObservables
} from '../../models/fixture.model';
import {filter, first} from 'rxjs';
import {SwipeGestureDirective} from '../../directives/swipeGesture.directive';
import {League} from '../../models/league.model';
import {DataService} from '../../services/data.service';
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
    MatchComponent,
    NgForOf,
    NgClass,
    SwipeGestureDirective
  ],
})
export class FixturesComponent implements OnInit {
  authService = inject(AuthService);
  @Input({required: true}) fixtures!: FixturesObservables;
  @Input({required: true}) votes!: VotesObservables;

  dataService = inject(DataService);
  activeLeague: League | undefined;
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
        queryParams: {league: leagueId},
        queryParamsHandling: 'merge'
      }
    );
  }

  setActiveLeague = (id: string) => {
    this.dataService.leagues$
      .pipe(
        filter(leagues => !!leagues),
        first(),
      )
      .subscribe({
        next: (leagues) => {
          if (!leagues?.length) {
            return;
          }
          this.activeLeague = leagues?.find(
            (league) => league.id == id,
          ) ?? leagues[0];
        }
      })
  }

}
