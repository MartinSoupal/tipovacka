import {Component, inject} from '@angular/core';
import {DialogService} from '@ngneat/dialog';
import {DataService} from '../../../services/data.service';
import {AuthService} from '../../../services/auth.service';
import {SortByPipe} from '../../../pipes/sort-by.pipe';
import {
  AsyncPipe,
  DecimalPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {combineLatest, map, Observable} from 'rxjs';
import * as R from 'ramda';
import {User} from '../../../models/user.model';
import {DateFormatPipe} from '../../../pipes/date-format.pipe';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
  standalone: true,
  imports: [
    SortByPipe,
    AsyncPipe,
    NgForOf,
    TranslocoPipe,
    NgIf,
    NgClass,
    DecimalPipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DateFormatPipe
  ],
})
export class StandingsComponent {
  loadingArray = [0, 1, 2, 3, 4];
  dataService = inject(DataService);
  authService = inject(AuthService);
  data$: Observable<User[]> = combineLatest([
    this.dataService.standings$,
    this.dataService.selectedLeagues$,
  ])
    .pipe(
      map(
        ([users, selectedLeagues]) =>
          R.map(
            (user): User => {
              user.points = 0;
              user.correctVotes = 0;
              user.incorrectVotes = 0;
              for (const seasonKey in user.seasons) {
                const season = user.seasons[seasonKey];

                // Iterate through each userBase within the season
                for (const leagueKey in season) {
                  const league = season[leagueKey];
                  if (!selectedLeagues?.length || selectedLeagues.indexOf(leagueKey) !== -1) {
                    // Sum up correct and incorrect votes
                    user.correctVotes += league.correctVotes;
                    user.incorrectVotes += league.incorrectVotes;
                  }
                }
              }
              user.points = user.correctVotes - user.incorrectVotes;
              return user;
            },
            users || []
          )
      )
    )
  private dialog = inject(DialogService);

}
