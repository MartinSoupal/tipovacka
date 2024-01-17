import {Component, inject} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sign-in-alert',
  standalone: true,
  imports: [
    TranslocoPipe,
  ],
  templateUrl: './sign-in-alert.component.html',
  styleUrl: './sign-in-alert.component.scss'
})
export class SignInAlertComponent {
  ref: DialogRef<void, undefined> = inject(DialogRef);
  private authService = inject(AuthService);

  signIn = () => {
    this.authService.signIn();
    this.ref.close();
  }
}
