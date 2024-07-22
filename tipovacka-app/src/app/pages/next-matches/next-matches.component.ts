import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {FixturesComponent} from '../../components/fixtures/fixtures.component';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, first} from 'rxjs';
import {League} from '../../models/league.model';

@Component({
  selector: 'app-next-matches',
  templateUrl: './next-matches.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    TranslocoPipe,
    FixturesComponent,
    NgForOf,
    NgClass,
  ],
})
export class NextMatchesComponent implements OnInit {
  dataService = inject(DataService);
  activeLeague: League | undefined;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParamMap
      .subscribe({
        next: (params) => {
          if (params.has('league')) {
            this.setActiveLeague(params.get('league')!);
          } else {
            this.setActiveLeague('');
          }
        }
      })
  }

  selectActiveLeague = (event: Event) => {
    const leagueId: string = (event.target as HTMLSelectElement).value;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {league: leagueId},
        queryParamsHandling: 'merge'
      }
    );
  }

  setActiveLeague = (id: string) => {
    this.dataService.leagues$
      .pipe(
        filter(leagues => !!leagues),
        first()
      )
      .subscribe({
        next: (leagues) => {
          if (!leagues?.length) {
            return;
          }
          this.activeLeague = leagues?.find(
            (league) => league.id == id,
          ) ?? leagues[0];
        }
      })
  }
}
