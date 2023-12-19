import {Component, inject, Input} from '@angular/core';
import {MatchWithTeamName} from '../../models/match.model';
import {AuthService} from '../../services/auth.service';
import {Vote, VoteResult} from '../../models/vote.model';
import {DataService} from '../../services/data.service';
import {HotToastService} from '@ngneat/hot-toast';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent {
  @Input({required: true}) data!: MatchWithTeamName;
  @Input() votes: Record<string, Vote | undefined> = {};

  now = new Date();

  sendingVote: VoteResult | undefined = undefined;
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  private toastService = inject(HotToastService);
  private translocoService = inject(TranslocoService);

  chooseResult = (chosenResult: VoteResult) => {
    this.sendingVote = chosenResult;
    if (chosenResult === this.votes[this.data.id]?.result) {
      this.dataService.deleteVote(this.data.id)
        .pipe(
          this.toastService.observe({
            loading: this.translocoService.translate('VOTE_REMOVING'),
            success: this.translocoService.translate('VOTE_REMOVED'),
            error: this.translocoService.translate('VOTE_COULD_NOT_REMOVED'),
          })
        )
        .subscribe({
          next: () => {
            this.sendingVote = undefined;
          }
        })
      return;
    }
    this.dataService.addVote(this.data.id, chosenResult)
      .pipe(
        this.toastService.observe({
          loading: this.translocoService.translate('VOTE_SAVING'),
          success: this.translocoService.translate('VOTE_SAVED'),
          error: this.translocoService.translate('VOTE_COULD_NOT_SAVE'),
        })
      )
      .subscribe({
        next: () => {
          this.sendingVote = undefined;
        }
      })

  }
}
