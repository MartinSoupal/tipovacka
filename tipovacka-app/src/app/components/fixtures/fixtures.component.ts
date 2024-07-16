import {Component, inject, Input} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';

import {
  MatchSkeletonComponent
} from '../match-skeleton/match-skeleton.component';
import {MatchComponent} from '../match/match.component';
import {AuthService} from '../../services/auth.service';
import {Fixture} from '../../models/fixture.model';
import {Vote} from '../../models/vote.model';
import {BehaviorSubject} from 'rxjs';
import {SwipeGestureDirective} from '../../directives/swipeGesture.directive';
import {League} from '../../models/league.model';

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
export class FixturesComponent {
  authService = inject(AuthService);
  @Input({required: true}) fixtures?: BehaviorSubject<Fixture[]>;
  @Input({required: true}) votes?: BehaviorSubject<Record<string, Vote>>;
  @Input({required: true}) league!: League;

}
