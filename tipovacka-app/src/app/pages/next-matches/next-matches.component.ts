import {AfterContentChecked, Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslocoPipe} from '@ngneat/transloco';
import {FixturesComponent} from '../../components/fixtures/fixtures.component';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs';
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
export class NextMatchesComponent implements OnInit, AfterContentChecked {
  dataService = inject(DataService);

  activeLeagueIndex = 0;
  activeLeague!: League;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    addEventListener('swipeRight', () => {
      if (!this.activeLeagueIndex) {
        return;
      }
      this.setActiveLeague(this.activeLeagueIndex - 1);
    })
    addEventListener('swipeLeft', () => {
      this.dataService.leagues$.pipe(first()).subscribe({
        next: (leagues) => {
          if ((leagues?.length || 0) > (this.activeLeagueIndex + 1)) {
            this.setActiveLeague(this.activeLeagueIndex + 1);
          }
        }
      })
    })
    this.route.queryParamMap
      .subscribe({
        next: (params) => {
          if (params.has('league')) {
            this.dataService.leagues$
              .pipe(first())
              .subscribe({
                next: (leagues) => {
                  if (!leagues?.length) {
                    return;
                  }
                  this.setActiveLeague(leagues.findIndex(
                    (league) => league.name === params.get('league')
                  ));
                }
              })
          }
        }
      })
  }

  ngAfterContentChecked() {
    document.getElementById(`league-badge-${this.activeLeagueIndex}`)?.scrollIntoView({inline: 'center'});
  }

  setActiveLeague = (id: number) => {
    this.activeLeagueIndex = id;
    document.getElementById(`league-badge-${this.activeLeagueIndex}`)?.scrollIntoView({inline: 'center'});
    this.dataService.leagues$
      .pipe(
        first()
      )
      .subscribe({
        next: (leagues) => {
          if (!leagues?.length) {
            return;
          }
          this.activeLeague = leagues[id];
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: {league: leagues[id].name},
              queryParamsHandling: 'merge'
            }
          );
        }
      })
  }
}
