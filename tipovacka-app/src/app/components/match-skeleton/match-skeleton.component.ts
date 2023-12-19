import {Component, Input} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-match-skeleton',
  templateUrl: './match-skeleton.component.html',
  styleUrls: ['./match-skeleton.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ]
})
export class MatchSkeletonComponent {
  array = [0, 1, 2];
  @Input() small = false;
}
