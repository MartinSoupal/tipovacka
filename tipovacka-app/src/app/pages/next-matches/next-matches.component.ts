import {Component, inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FixturesComponent} from '../../components/fixtures/fixtures.component';

@Component({
  selector: 'app-next-matches',
  templateUrl: './next-matches.component.html',
  standalone: true,
  imports: [FixturesComponent],
})
export class NextMatchesComponent {
  dataService = inject(DataService);
}
