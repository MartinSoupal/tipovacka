import {Component, inject} from '@angular/core';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'app-previous-matches',
  templateUrl: './previous-matches.component.html',
  styleUrls: ['./previous-matches.component.scss']
})
export class PreviousMatchesComponent {
  dataService = inject(DataService);
}
