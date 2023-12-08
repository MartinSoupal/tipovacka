import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {User} from '../../../models/user.model';
import {
  CreateUserLeagueComponent
} from '../../../components/create-user-league/create-user-league.component';
import {DialogService} from '@ngneat/dialog';
import {UserLeague} from '../../../models/user-league.model';
import {
  ChooseUserLeagueComponent
} from '../../../components/choose-user-league/choose-user-league.component';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {
  @Input() users: User[] = [];
  @Input() loading = false;
  @Input() userLeagues: UserLeague[] = [];
  @Output() userLeagueSelected = new EventEmitter<UserLeague | undefined>();

  loadingArray = [0, 1, 2, 3, 4];
  sortBy: 'correctVotes' | 'correctRatio' = 'correctVotes';
  chosenUserLeague: UserLeague | undefined;
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
    dialogRef.afterClosed$
      .subscribe({
        next: (newUserLeague) => {
          if (!newUserLeague) {
            return;
          }
          this.userLeagues.push(newUserLeague);
        }
      })
  }

  openChooseUserLeagueModal() {
    const dialogRef = this.dialog.open(
      ChooseUserLeagueComponent,
      {
        data: {
          userLeagues: this.userLeagues,
        },
      }
    )
    dialogRef.afterClosed$
      .subscribe({
        next: chosenUserLeague => {
          if (chosenUserLeague === 'cancel') {
            return;
          }
          this.chosenUserLeague = chosenUserLeague;
          this.userLeagueSelected.emit(chosenUserLeague);
        }
      })
  }
}
