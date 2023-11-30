import {Pipe, PipeTransform} from '@angular/core';
import {League, MatchWithTeamName} from '../models/match.model';
import {filter, includes} from 'ramda';

@Pipe({
  name: 'filterMatchesBy'
})
export class FilterMatchesByPipe implements PipeTransform {

  transform(matches: MatchWithTeamName[], leagues: League[]): MatchWithTeamName[] {
    if (!Array.isArray(matches)) {
      return matches;
    }

    if (!leagues.length) {
      return matches;
    }

    return filter(
      (match) => includes(match.league, leagues),
      matches
    )
  }

}
