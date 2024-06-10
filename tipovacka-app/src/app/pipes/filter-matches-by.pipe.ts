import {Pipe, PipeTransform} from '@angular/core';
import {filter, includes} from 'ramda';
import {Fixture} from '../models/fixture.model';

@Pipe({
  name: 'filterMatchesBy',
  standalone: true,
})
export class FilterMatchesByPipe implements PipeTransform {

  transform(matches: Fixture[], leagues: string[]): Fixture[] {
    if (!Array.isArray(matches)) {
      return matches;
    }

    return filter(
      (match) => includes(match.leagueName, leagues),
      matches
    )
  }

}
