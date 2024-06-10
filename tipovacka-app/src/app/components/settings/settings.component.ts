import {Component, inject, OnInit} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe, TranslocoService} from '@ngneat/transloco';
import {AuthService} from '../../services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    TranslocoPipe,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  ref: DialogRef<void, undefined> = inject(DialogRef);
  authService = inject(AuthService);
  actualLang: string = '';
  private translocoService = inject(TranslocoService);

  ngOnInit() {
    this.actualLang = this.translocoService.getActiveLang();
  }

  signOut = () => {
    this.authService.signOut();
    this.ref.close();
  }

  signIn = () => {
    this.authService.signIn();
    this.ref.close();
  }

  changeLang = () => {
    switch (this.actualLang) {
      case 'cs':
        this.translocoService.setActiveLang('en');
        this.actualLang = 'en';
        break;
      case 'us':
        this.translocoService.setActiveLang('cs');
        this.actualLang = 'cs';
        break;
      default:
        this.translocoService.setActiveLang('cs');
        this.actualLang = 'cs';
    }
    localStorage.setItem('lang', this.actualLang);
  }
}
