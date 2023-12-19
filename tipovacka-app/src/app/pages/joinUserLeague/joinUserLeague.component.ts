import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {combineLatest, delay} from 'rxjs';
import {DataService} from '../../services/data.service';
import {HotToastService} from '@ngneat/hot-toast';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-join-user-league',
  templateUrl: './joinUserLeague.component.html',
  styleUrls: ['./joinUserLeague.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ]
})
export class JoinUserLeagueComponent implements OnInit {
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private toastService = inject(HotToastService);

  ngOnInit() {
    combineLatest([
      this.route.paramMap,
      this.authService.isSignIn$,
    ])
      .pipe(
        delay(200),
      )
      .subscribe({
        next: ([params, isSignIn]) => {
          if (!isSignIn) {
            return;
          }
          const userLeagueId = params.get('userLeagueId') as string;
          this.dataService.joinUserLeague(userLeagueId)
            .subscribe({
              next: () => {
                void this.router.navigate([''], {queryParams: {ul: userLeagueId}});
                this.toastService.success('Úspěšně jste se připojil/a do ligy přátel.');
              }
            })
        }
      })
  }
}
