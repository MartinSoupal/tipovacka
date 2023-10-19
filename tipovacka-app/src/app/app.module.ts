import {isDevMode, LOCALE_ID, NgModule} from '@angular/core';
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

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
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
    ResultButtonComponent
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
    ReactiveFormsModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'cs-CZ'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
