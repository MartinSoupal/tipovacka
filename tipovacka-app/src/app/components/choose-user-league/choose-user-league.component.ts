import {Component, inject} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';
import {NgForOf} from '@angular/common';
import {UserLeague} from '../../models/user-league.model';

export type ChooseUserLeagueDialogData = {
  userLeagues: UserLeague[]
}

@Component({
  selector: 'app-create-user-league',
  standalone: true,
  imports: [
    TranslocoPipe,
    NgForOf
  ],
  templateUrl: './choose-user-league.component.html',
  styleUrl: './choose-user-league.component.scss'
})
export class ChooseUserLeagueComponent {
  ref: DialogRef<ChooseUserLeagueDialogData, UserLeague | undefined | 'cancel'> = inject(DialogRef);

  chooseUserLeague = (userLeague: UserLeague) => {
    this.ref.close(userLeague);
  }
}
