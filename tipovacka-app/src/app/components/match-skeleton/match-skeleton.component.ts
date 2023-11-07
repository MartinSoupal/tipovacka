import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-match-skeleton',
  templateUrl: './match-skeleton.component.html',
  styleUrls: ['./match-skeleton.component.scss']
})
export class MatchSkeletonComponent {
  array = [0, 1, 2];
  @Input() small = false;
}
