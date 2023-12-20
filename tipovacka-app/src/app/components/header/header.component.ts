import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {AsyncPipe, NgIf} from '@angular/common';
import {DialogService} from '@ngneat/dialog';
import {InfoComponent} from '../info/info.component';

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
  private translocoService = inject(TranslocoService);
  private dialogService = inject(DialogService);

  goToAdmin = () => {
    void this.router.navigate(['admin']);
  }

  changeLang = () => {
    const actualLang = this.translocoService.getActiveLang();
    switch (actualLang) {
      case 'cs':
        this.translocoService.setActiveLang('en');
        break;
      case 'us':
        this.translocoService.setActiveLang('cs');
        break;
      default:
        this.translocoService.setActiveLang('cs')
    }
  }

  openInfoModal = () => {
    this.dialogService.open(InfoComponent);
  }
}
