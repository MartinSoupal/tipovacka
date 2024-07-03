import {Component, inject} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {AuthService} from '../../../services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {
  MatchesOverviewComponent
} from '../../../components/matches-overview/matches-overview.component';
import {
  MatchSkeletonComponent
} from '../../../components/match-skeleton/match-skeleton.component';

@Component({
  selector: 'app-next-matches',
  templateUrl: './next-matches.component.html',
  styleUrls: ['./next-matches.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    TranslocoPipe,
    MatchesOverviewComponent,
    MatchSkeletonComponent
  ],
})
export class NextMatchesComponent {
  dataService = inject(DataService);
  authService = inject(AuthService);
}
