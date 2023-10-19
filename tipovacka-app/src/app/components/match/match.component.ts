import {Component, Input} from '@angular/core';
import {MatchResult, MatchWithTeamName} from '../../models/match.model';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent {
  @Input() data: MatchWithTeamName | undefined;

  constructor(
    private dataService: DataService
  ) {
  }

  chooseResult = (chosenResult: MatchResult) => {
    this.dataService.addVote(this.data!.id, chosenResult)
      .subscribe({
        next: () => {
          this.data!.vote = chosenResult;
        }
      })
  }
}
