import {Component, Input} from '@angular/core';
import {MatchWithTeamName} from '../../../models/match.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-next-matches',
  templateUrl: './next-matches.component.html',
  styleUrls: ['./next-matches.component.scss']
})
export class NextMatchesComponent {
  @Input() nextMatches: MatchWithTeamName[] = [];
  @Input() leagues: string[] = [];
  @Input() loading = true;

  constructor(
    public authService: AuthService
  ) {
  }
}
