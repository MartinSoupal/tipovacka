import {Component, inject} from '@angular/core';
import {DialogRef, DialogService} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {UserLeague} from '../../models/user-league.model';
import {
  CreateUserLeagueComponent
} from '../create-user-league/create-user-league.component';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-create-user-league',
  standalone: true,
  imports: [
    TranslocoPipe,
    NgForOf,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './choose-user-league.component.html',
  styleUrl: './choose-user-league.component.scss'
})
export class ChooseUserLeagueComponent {
  ref: DialogRef<void, undefined> = inject(DialogRef);
  dialog = inject(DialogService);
  dataService = inject(DataService);

  chooseUserLeague = (userLeague?: UserLeague) => {
    this.dataService.setSelectedUserLeague(userLeague);
    this.ref.close();
  }

  openCreateUserLeagueModal() {
    this.ref.close();
    this.dialog.open(CreateUserLeagueComponent);
  }

  deleteUserLeague = (userLeagueId: string) => {
    this.dataService.deleteUserLeague(userLeagueId)
      .subscribe();
  }
}
