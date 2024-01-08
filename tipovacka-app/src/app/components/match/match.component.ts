import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {MatchWithTeamName} from '../../models/match.model';
import {AuthService} from '../../services/auth.service';
import {Vote, VoteResult} from '../../models/vote.model';
import {DataService} from '../../services/data.service';
import {TranslocoPipe} from '@ngneat/transloco';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {first} from 'rxjs';
import {DialogService} from '@ngneat/dialog';
import {SignInAlertComponent} from '../sign-in-alert/sign-in-alert.component';
import {DatetimeFormatPipe} from '../../pipes/datetime-format.pipe';
import {ImageSrcErrorDirective} from '../../directives/imgSrcError.directive';

type TeamState =
  'normal'
  | 'highlight'
  | 'correct'
  | 'incorrect';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    TranslocoPipe,
    AsyncPipe,
    NgClass,
    DatetimeFormatPipe,
    ImageSrcErrorDirective
  ]
})
export class MatchComponent implements OnChanges, OnInit {
  @Input({required: true}) data!: MatchWithTeamName;
  @Input() votes?: Record<string, Vote | undefined>;

  now = new Date();

  sendingVote?: VoteResult = undefined;
  public authService = inject(AuthService);
  states: Record<1 | 0 | 2, TeamState> = {
    1: 'normal',
    0: 'normal',
    2: 'normal',
  }
  hides: Record<1 | 0 | 2, boolean> = {
    1: false,
    0: false,
    2: false,
  }
  protected readonly undefined = undefined;
  private dataService = inject(DataService);
  private dialogService = inject(DialogService);

  chooseResult = (chosenResult: VoteResult) => {
    this.authService.isSignIn$
      .pipe(
        first()
      )
      .subscribe({
        next: (isSignIn) => {
          if (!isSignIn) {
            this.dialogService.open(SignInAlertComponent);
            return;
          }
          this.sendingVote = chosenResult;
          if (this.votes && chosenResult === this.votes[this.data.id]?.result) {
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
      })
  }

  ngOnInit() {
    this.calculateStates();
  }

  ngOnChanges() {
    this.calculateStates();
  }

  calculateStates = () => {
    this.states['1'] = 'normal';
    this.states['0'] = 'normal';
    this.states['2'] = 'normal';
    if (this.data.datetime > this.now) {
      if (!this.votes || !this.votes[this.data.id] || this.votes[this.data.id]?.result === null) {
        return;
      }
      this.hides['1'] = true;
      this.hides['0'] = true;
      this.hides['2'] = true;
      this.states[this.votes[this.data.id]!.result] = 'highlight';
      this.hides[this.votes[this.data.id]!.result] = false;
      return;
    }

    this.hides['1'] = true;
    this.hides['0'] = true;
    this.hides['2'] = true;
    if (this.votes && this.votes[this.data.id]) {
      this.states[this.votes[this.data.id]!.result] = 'incorrect';
      this.hides[this.votes[this.data.id]!.result] = false;
    }
    this.states[this.data.result!] = 'correct';
  }
}
