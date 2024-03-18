import {Component, inject, Input} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
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
    FilterMatchesByPipe
  ],
})
export class FixturesComponent {
  dataService = inject(DataService);
  authService = inject(AuthService);

  @Input({required: true}) fixtures?: Fixture[];
  @Input({required: true}) votes?: Record<string, Vote | undefined>;
}
