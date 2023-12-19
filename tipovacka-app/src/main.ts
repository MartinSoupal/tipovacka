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
import {DashboardComponent} from './app/pages/dashboard/dashboard.component';
import {UserTokenResolver} from './app/resolver/token.resolver';
import {AdminComponent} from './app/pages/admin/admin.component';
import {
  JoinUserLeagueComponent
} from './app/pages/joinUserLeague/joinUserLeague.component';

const routes: Routes = [
  {
    path: 'dashboard/:activeTab',
    component: DashboardComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: 'admin',
    component: AdminComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: ':userLeagueId/join',
    component: JoinUserLeagueComponent,
    resolve: {'isSignIn': () => inject(UserTokenResolver).resolve()}
  },
  {
    path: '**',
    redirectTo: '/dashboard/next'
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
        HotToastModule.forRoot()
      ])
    ],
  }
)
  .catch(e => console.error(e));
