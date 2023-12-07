import {Component, inject, Input} from '@angular/core';
import {User} from '../../../models/user.model';
import {CreateUserLeagueComponent} from '../../../components/create-user-league/create-user-league.component';
import {DialogService} from '@ngneat/dialog';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {
  @Input() users: User[] = [];
  @Input() loading = false;

  loadingArray = [0, 1, 2, 3, 4];

  sortBy: 'correctVotes' | 'correctRatio' = 'correctVotes';
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
    const dialogRef = this.dialog.open(CreateUserLeagueComponent);
  }
}
