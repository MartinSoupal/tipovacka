import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {DialogService} from '@ngneat/dialog';
import {SettingsComponent} from '../settings/settings.component';
import {
  LeaguesFilterComponent
} from '../leagues-filter/leagues-filter.component';
import {TranslocoPipe} from '@ngneat/transloco';

type Tabs = 'results' | 'next' | 'standings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe,
    TranslocoPipe,
    NgClass
  ]
})
export class HeaderComponent implements OnInit {

  authService = inject(AuthService);
  activeTab: Tabs = 'next';
  private dialogService = inject(DialogService);
  private route = inject(ActivatedRoute);

  openSettingsModal = () => {
    this.dialogService.open(SettingsComponent);
  }

  openLeagueFilterModal = () => {
    this.dialogService.open(LeaguesFilterComponent);
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe({
        next: (params) => {
          this.activeTab = (params.get('activeTab') as Tabs) || 'next';
        }
      })
  }
}
