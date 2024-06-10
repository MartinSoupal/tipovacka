import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {DialogService} from '@ngneat/dialog';
import {SettingsComponent} from '../settings/settings.component';
import {TranslocoPipe} from '@ngneat/transloco';
import {filter} from 'rxjs';

type Tabs = '/schedule' | '/results' | '/standings';

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
  activeTab: Tabs = '/schedule';
  private dialogService = inject(DialogService);
  private router = inject(Router);

  openSettingsModal = () => {
    this.dialogService.open(SettingsComponent);
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe({
        next: (data) => {
          this.activeTab = ((data as NavigationEnd).urlAfterRedirects.split('?')[0]) as Tabs;
        }
      })
  }
}
