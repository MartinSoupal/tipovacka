import {Component, inject} from '@angular/core';
import {
  CreateUserLeagueComponent
} from '../../../components/create-user-league/create-user-league.component';
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
import {
  UserLeaguesOverviewComponent
} from '../../../components/user-leagues-overview/user-leagues-overview.component';

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
    NgSwitchDefault
  ],
})
export class StandingsComponent {
  loadingArray = [0, 1, 2, 3, 4];
  dataService = inject(DataService);
  authService = inject(AuthService);
  private dialog = inject(DialogService);

  openCreateUserLeagueModal() {
    this.dialog.open(CreateUserLeagueComponent, {id: 'create-user-league'});
  }

  openUserLeaguesOverviewModal() {
    this.dialog.open(UserLeaguesOverviewComponent, {
      size: "lg",
      id: 'user-leagues-overview'
    });
  }
}
