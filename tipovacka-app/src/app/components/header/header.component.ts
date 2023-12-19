import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {AsyncPipe, NgIf} from '@angular/common';

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

  constructor(
    public authService: AuthService,
    private router: Router,
    private translocoService: TranslocoService
  ) {
  }

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
}
