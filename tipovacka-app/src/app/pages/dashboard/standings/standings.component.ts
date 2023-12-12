import {Component, inject} from '@angular/core';
import {
  CreateUserLeagueComponent
} from '../../../components/create-user-league/create-user-league.component';
import {DialogService} from '@ngneat/dialog';
import {
  ChooseUserLeagueComponent
} from '../../../components/choose-user-league/choose-user-league.component';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {
  loadingArray = [0, 1, 2, 3, 4];
  sortBy: 'correctVotes' | 'correctRatio' = 'correctVotes';
  dataService = inject(DataService);
  private dialog = inject(DialogService);

  toggleSort = () => {
    if (this.sortBy === 'correctVotes') {
      this.sortBy = 'correctRatio';
      return;
    }
    if (this.sortBy === 'correctRatio') {
      this.sortBy = 'correctVotes';
      return;
    }
  }

  openCreateUserLeagueModal() {
    this.dialog.open(CreateUserLeagueComponent);
  }

  openChooseUserLeagueModal() {
    this.dialog.open(ChooseUserLeagueComponent, {size: "lg"})
  }
}
