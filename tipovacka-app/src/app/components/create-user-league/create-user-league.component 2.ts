import {Component} from '@angular/core';
import {TranslocoPipe} from '@ngneat/transloco';
import {DialogRef} from '@ngneat/dialog';

@Component({
  standalone: true,
  selector: 'app-create-user-league',
  templateUrl: './create-user-league.component.html',
  imports: [
    TranslocoPipe
  ],
  styleUrls: ['./create-user-league.component.scss']
})
export class CreateUserLeagueComponent {
  constructor(private dialogRef: DialogRef) {
  }
}
