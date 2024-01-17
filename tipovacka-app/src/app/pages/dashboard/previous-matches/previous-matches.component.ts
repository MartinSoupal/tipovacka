import {Component, inject} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {UserLeague} from '../../../models/user-league.model';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {
  MatchesOverviewComponent
} from '../../../components/matches-overview/matches-overview.component';
import {
  MatchSkeletonComponent
} from '../../../components/match-skeleton/match-skeleton.component';

@Component({
  selector: 'app-previous-matches',
  templateUrl: './previous-matches.component.html',
  styleUrls: ['./previous-matches.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslocoPipe,
    MatchesOverviewComponent,
    MatchSkeletonComponent
  ]
})
export class PreviousMatchesComponent {
  dataService = inject(DataService);

  processLeagues(userLeague: UserLeague | undefined): string[] | undefined {
    return userLeague?.leagues;
  }
}
