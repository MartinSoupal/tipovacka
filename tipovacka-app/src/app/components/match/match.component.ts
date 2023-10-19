import {Component, Input} from '@angular/core';
import {MatchResult, MatchWithTeamName} from '../../models/match.model';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent {
  @Input() data: MatchWithTeamName | undefined;

  chosenResult: MatchResult = null;

  chooseResult = (chosenResult: MatchResult) => {
    this.chosenResult = chosenResult;
  }
}
