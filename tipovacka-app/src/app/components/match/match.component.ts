import {Component, inject, Input} from '@angular/core';
import {MatchWithTeamName} from '../../models/match.model';
import {AuthService} from '../../services/auth.service';
import {Vote, VoteResult} from '../../models/vote.model';
import {DataService} from '../../services/data.service';
import {TranslocoPipe} from '@ngneat/transloco';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {ResultButtonComponent} from '../result-button/result-button.component';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    TranslocoPipe,
    AsyncPipe,
    ResultButtonComponent,
    NgClass
  ]
})
export class MatchComponent {
  @Input({required: true}) data!: MatchWithTeamName;
  @Input() votes: Record<string, Vote | undefined> = {};

  now = new Date();

  sendingVote: VoteResult | undefined = undefined;
  public authService = inject(AuthService);
  private dataService = inject(DataService);

  chooseResult = (chosenResult: VoteResult) => {
    this.sendingVote = chosenResult;
    if (chosenResult === this.votes[this.data.id]?.result) {
      this.dataService.deleteVote(this.data.id)
        .then(
          () => {
            this.sendingVote = undefined;
          }
        )
      return;
    }
    this.dataService.addVote(this.data.id, chosenResult)
      .then(
        () => {
          this.sendingVote = undefined;
        }
      )
  }
}
