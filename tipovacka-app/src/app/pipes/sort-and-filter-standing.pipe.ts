import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../models/user.model';
import * as R from 'ramda';

@Pipe({
  name: 'sortAndFilterStanding',
  standalone: true,
  pure: false,
})
export class SortAndFilterStandingPipe implements PipeTransform {
  transform(array: User[], filterLeague: string[]): User[] {
    if (!Array.isArray(array)) {
      return array;
    }

    R.forEach(
      (user: User) => {
        let correctVotes = 0;
        let incorrectVotes = 0;
        for (const seasonKey in user.seasons) {
          const season = user.seasons[seasonKey];
          for (const leagueKey in season) {
            if (filterLeague.includes('TOTAL') || filterLeague.indexOf(leagueKey) !== -1) {
              const league = season[leagueKey];
              correctVotes += league.correctVotes;
              incorrectVotes += league.incorrectVotes;
            }
          }
        }
        user.correctVotes = correctVotes;
        user.incorrectVotes = incorrectVotes;
        user.points = user.correctVotes - user.incorrectVotes;
      },
      array
    )

    return array.sort((a, b) => {
      for (const prop of ['points', 'correctVotes'] as (keyof User)[]) {
        if (a[prop] < b[prop]) {
          return 1;
        } else if (a[prop] > b[prop]) {
          return -1;
        }
      }
      return 0;
    });
  }
}
