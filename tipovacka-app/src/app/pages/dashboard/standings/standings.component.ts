import {Component, Input} from '@angular/core';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {
  @Input() users: User[] = [];
}
