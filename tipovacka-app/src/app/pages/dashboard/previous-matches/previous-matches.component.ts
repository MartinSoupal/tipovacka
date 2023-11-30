import {Component, Input} from '@angular/core';
import {League, MatchWithTeamName} from '../../../models/match.model';

@Component({
  selector: 'app-previous-matches',
  templateUrl: './previous-matches.component.html',
  styleUrls: ['./previous-matches.component.scss']
})
export class PreviousMatchesComponent {
  @Input() prevMatches: MatchWithTeamName[] = [];
  @Input() leagues: League[] = [];
  @Input() loading = false;
}
