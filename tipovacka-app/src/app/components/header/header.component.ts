import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {DialogService} from '@ngneat/dialog';
import {SettingsComponent} from '../settings/settings.component';
import {
  LeaguesFilterComponent
} from '../leagues-filter/leagues-filter.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe
  ]
})
export class HeaderComponent {

  authService = inject(AuthService);
  private dialogService = inject(DialogService);

  openSettingsModal = () => {
    this.dialogService.open(SettingsComponent);
  }

  openLeagueFilterModal = () => {
    this.dialogService.open(LeaguesFilterComponent);
  }
}
