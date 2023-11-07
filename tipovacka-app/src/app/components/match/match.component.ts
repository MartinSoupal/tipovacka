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

  now = new Date();

  constructor(
    private dataService: DataService
  ) {
  }

  chooseResult = (chosenResult: MatchResult) => {
    if (chosenResult === this.data?.vote) {
      chosenResult = null;
    }
    this.dataService.addVote(this.data!.id, chosenResult)
      .subscribe({
        next: () => {
          if (this.data && this.data.vote !== null) {
            this.data![this.data.vote]--;
          }
          if (this.data && this.data.vote === null) {
            this.data.totalVotes++;
          }
          if (chosenResult !== null) {
            this.data![chosenResult]++;
          }
          if (chosenResult === null) {
            this.data!.totalVotes--;
          }
          this.data!.vote = chosenResult;
        }
      })
  }
}
