import {Component, inject} from '@angular/core';
import {DialogRef, DialogService} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {UserLeague} from '../../models/user-league.model';
import {
  CreateUserLeagueComponent
} from '../create-user-league/create-user-league.component';
import {DataService} from '../../services/data.service';
import {HotToastService} from '@ngneat/hot-toast';
import {
  UsersForUserLeagueComponent
} from '../users-for-user-league/users-for-user-league.component';
import {SortByPipe} from '../../pipes/sort-by.pipe';

@Component({
  selector: 'app-user-leagues-overview',
  standalone: true,
  imports: [
    TranslocoPipe,
    NgForOf,
    AsyncPipe,
    NgIf,
    SortByPipe
  ],
  templateUrl: './user-leagues-overview.component.html',
  styleUrl: './user-leagues-overview.component.scss'
})
export class UserLeaguesOverviewComponent {
  ref: DialogRef<void, undefined> = inject(DialogRef);
  dialog = inject(DialogService);
  dataService = inject(DataService);
  private toastService = inject(HotToastService);

  chooseUserLeague = (userLeague?: UserLeague) => {
    this.dataService.setSelectedUserLeague(userLeague);
    this.ref.close();
  }

  openCreateUserLeagueModal() {
    this.dialog.open(CreateUserLeagueComponent, {id: 'create-user-league'});
  }

  deleteUserLeague = (userLeagueId: string) => {
    this.dataService.deleteUserLeague(userLeagueId);
  }

  invite = (userLeagueId: string) => {
    void navigator.clipboard.writeText(`${location.origin}/${userLeagueId}/join`);
    this.toastService.success('Invite link has been copy into clipboard.');
  }

  leave = (userLeagueId: string) => {
    this.dataService.leaveUserLeague(userLeagueId);
  }

  openUsersInUserLeagueModal(userLeague: UserLeague) {
    this.dialog.open(UsersForUserLeagueComponent, {
      data: {userLeague},
      id: 'users-in-user-league'
    });
  }

}
