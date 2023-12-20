import {Component, inject, OnInit} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe, TranslocoService} from '@ngneat/transloco';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {UserInUserLeague, UserLeague} from '../../models/user-league.model';
import {ApiService} from '../../services/api.service';
import {first} from 'rxjs';
import {HotToastService} from '@ngneat/hot-toast';
import * as R from 'ramda';
import {AuthService} from '../../services/auth.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-users-for-user-league',
  standalone: true,
  imports: [
    TranslocoPipe,
    NgForOf,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './users-for-user-league.component.html',
  styleUrl: './users-for-user-league.component.scss'
})
export class UsersForUserLeagueComponent implements OnInit {
  ref: DialogRef<{ userLeague: UserLeague }, undefined> = inject(DialogRef);
  users: UserInUserLeague[] = [];
  authService = inject(AuthService);
  private apiService = inject(ApiService);
  private toastService = inject(HotToastService);
  private dataService = inject(DataService);
  private translocoService = inject(TranslocoService);

  ngOnInit() {
    this.apiService.getUserLeagueUsers(this.ref.data.userLeague.id)
      .pipe(
        first()
      )
      .subscribe({
        next: (users) => {
          this.users = users;
        }
      })
  }

  removeUser = (userUid: string) => {
    this.apiService.deleteUserFromUserLeague(this.ref.data.userLeague.id, userUid)
      .pipe(
        this.toastService.observe({
          loading: this.translocoService.translate('USER_REMOVING'),
          success: this.translocoService.translate('USER_REMOVED'),
          error: this.translocoService.translate('USER_COULD_NOT_REMOVE'),
        })
      )
      .subscribe({
        next: () => {
          this.users = R.reject<UserInUserLeague, UserInUserLeague[]>(
            (user) => user.userUid === userUid,
            this.users,
          );
          if (!this.users.length) {
            this.ref.close();
          }
        }
      })
  }

  leave = () => {
    this.dataService.leaveUserLeague(this.ref.data.userLeague.id);
  }
}
