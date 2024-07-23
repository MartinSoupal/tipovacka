import {Component, inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FixturesComponent} from '../../components/fixtures/fixtures.component';

@Component({
  selector: 'app-previous-matches',
  templateUrl: './previous-matches.component.html',
  standalone: true,
  imports: [FixturesComponent]
})
export class PreviousMatchesComponent {
  dataService = inject(DataService);
}
