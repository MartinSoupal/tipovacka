import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {DialogService} from '@ngneat/dialog';
import {SettingsComponent} from '../settings/settings.component';

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
  private router = inject(Router);
  private dialogService = inject(DialogService);

  goToAdmin = () => {
    void this.router.navigate(['admin']);
  }

  openSettingsModal = () => {
    this.dialogService.open(SettingsComponent);
  }
}
