import {inject, isDevMode, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {environment} from '../environments/environments';
import {HeaderComponent} from './components/header/header.component';
import {HttpClientModule} from '@angular/common/http';
import {MatchComponent} from './components/match/match.component';
import {RouterModule, RouterOutlet, Routes} from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AdminComponent} from './pages/admin/admin.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ResultButtonComponent} from './components/result-button/result-button.component';
import {registerLocaleData} from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import {UserTokenResolver} from './resolver/token.resolver';
import {SortByPipe} from './pipes/sort-by.pipe';
import {PreviousMatchesComponent} from './pages/dashboard/previous-matches/previous-matches.component';
import {NextMatchesComponent} from './pages/dashboard/next-matches/next-matches.component';
import {StandingsComponent} from './pages/dashboard/standings/standings.component';
import {MatchSkeletonComponent} from './components/match-skeleton/match-skeleton.component';
import {FilterMatchesByPipe} from './pipes/filter-matches-by.pipe';
import {MatchesOverviewComponent} from './components/matches-overview/matches-overview.component';
import {TranslocoRootModule} from './transloco-root.module';
import {DatetimeFormatPipe} from './pipes/datetime-format.pipe';
import {AdminDatetimeFormatPipe} from './pipes/admin-datetime-format.pipe';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: 'admin',
    component: AdminComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: '**',
    redirectTo: ''
  }
];

registerLocaleData(localeCs);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MatchComponent,
    DashboardComponent,
    AdminComponent,
    ResultButtonComponent,
    SortByPipe,
    SortByPipe,
    PreviousMatchesComponent,
    NextMatchesComponent,
    StandingsComponent,
    MatchSkeletonComponent,
    FilterMatchesByPipe,
    MatchesOverviewComponent,
    DatetimeFormatPipe,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule,
    RouterOutlet,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    TranslocoRootModule,
    AdminDatetimeFormatPipe
  ],
  providers: [{provide: LOCALE_ID, useValue: 'cs-CZ'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
