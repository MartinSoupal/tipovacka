import {Component, Input} from '@angular/core';
import {MatchWithTeamName} from '../../../models/match.model';

@Component({
  selector: 'app-next-matches',
  templateUrl: './next-matches.component.html',
  styleUrls: ['./next-matches.component.scss']
})
export class NextMatchesComponent {
  @Input() groupOfNextMatches: MatchWithTeamName[][] = [];
}
