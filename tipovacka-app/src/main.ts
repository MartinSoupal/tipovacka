import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {registerLocaleData} from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import {importProvidersFrom, inject, isDevMode, LOCALE_ID} from '@angular/core';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from './environments/environments';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {ServiceWorkerModule} from '@angular/service-worker';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, RouterOutlet, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslocoRootModule} from './app/transloco-root.module';
import {HotToastModule} from '@ngneat/hot-toast';
import {UserTokenResolver} from './app/resolver/token.resolver';
import {
  NextMatchesComponent
} from './app/pages/next-matches/next-matches.component';
import {
  PreviousMatchesComponent
} from './app/pages/previous-matches/previous-matches.component';
import {StandingsComponent} from './app/pages/standings/standings.component';

const routes: Routes = [
  {
    path: 'schedule',
    component: NextMatchesComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: 'results',
    component: PreviousMatchesComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: 'standings',
    component: StandingsComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: '**',
    redirectTo: 'schedule'
  }
];

registerLocaleData(localeCs);
bootstrapApplication(
  AppComponent,
  {
    providers: [
      {provide: LOCALE_ID, useValue: 'cs-CZ'},
      importProvidersFrom([
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
        HotToastModule.forRoot({
          duration: 1000,
        })
      ])
    ],
  }
)
  .catch(e => console.error(e));
