import {Component, inject} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {UserLeague} from '../../../models/user-league.model';

@Component({
  selector: 'app-previous-matches',
  templateUrl: './previous-matches.component.html',
  styleUrls: ['./previous-matches.component.scss']
})
export class PreviousMatchesComponent {
  dataService = inject(DataService);

  processLeagues(userLeague: UserLeague | undefined): string[] | undefined {
    return userLeague?.leagues;
  }
}
