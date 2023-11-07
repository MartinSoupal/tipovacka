import {Component, Input} from '@angular/core';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {
  @Input() users: User[] = [];
  @Input() loading = false;

  loadingArray = [0, 1, 2, 3, 4];

  sortBy: 'correctVotes' | 'correctRatio' = 'correctVotes';

  toggleSort = () => {
    if (this.sortBy === 'correctVotes') {
      this.sortBy = 'correctRatio';
      return;
    }
    if (this.sortBy === 'correctRatio') {
      this.sortBy = 'correctVotes';
      return;
    }
  }
}
