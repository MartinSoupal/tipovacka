import {Component, inject, Input} from '@angular/core';
import {Vote} from '../../models/vote.model';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {DateToNumberPipe} from '../../pipes/date-to-number.pipe';
import {TranslocoPipe} from '@ngneat/transloco';
import {DatetimeFormatPipe} from '../../pipes/datetime-format.pipe';
import {MatchComponent} from '../match/match.component';
import {FilterMatchesByPipe} from '../../pipes/filter-matches-by.pipe';
import {Fixture2} from '../../models/fixture.model';
import {DataService} from '../../services/data.service';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-matches-overview',
  templateUrl: './matches-overview.component.html',
  styleUrls: ['./matches-overview.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    DateToNumberPipe,
    TranslocoPipe,
    DatetimeFormatPipe,
    MatchComponent,
    FilterMatchesByPipe,
    AsyncPipe,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf
  ]
})
export class MatchesOverviewComponent {
  @Input() matches: Fixture2[] = [];
  @Input() votes?: Record<string, Vote | undefined>;
  dataService = inject(DataService);
}
