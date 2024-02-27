import {Component, inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {FixturesComponent} from '../../components/fixtures/fixtures.component';

@Component({
  selector: 'app-previous-matches',
  templateUrl: './previous-matches.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslocoPipe,
    FixturesComponent
  ]
})
export class PreviousMatchesComponent {
  dataService = inject(DataService);
}
