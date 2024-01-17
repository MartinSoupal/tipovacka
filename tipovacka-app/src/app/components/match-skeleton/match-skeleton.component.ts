import {Component, Input} from '@angular/core';
import {AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {DatetimeFormatPipe} from '../../pipes/datetime-format.pipe';
import {TranslocoPipe} from '@ngneat/transloco';

@Component({
  selector: 'app-match-skeleton',
  templateUrl: './match-skeleton.component.html',
  styleUrls: ['./match-skeleton.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    AsyncPipe,
    DatetimeFormatPipe,
    DecimalPipe,
    NgIf,
    TranslocoPipe
  ]
})
export class MatchSkeletonComponent {
  array = [0, 1, 2];
  @Input() small = false;
  protected readonly undefined = undefined;
}
