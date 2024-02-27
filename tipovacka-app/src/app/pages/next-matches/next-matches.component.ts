import {Component, inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {FixturesComponent} from '../../components/fixtures/fixtures.component';

@Component({
  selector: 'app-next-matches',
  templateUrl: './next-matches.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    TranslocoPipe,
    FixturesComponent
  ],
})
export class NextMatchesComponent {
  dataService = inject(DataService);
}
