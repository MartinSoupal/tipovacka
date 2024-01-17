import {inject, Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider} from '@angular/fire/auth';
import {map, take} from 'rxjs';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth); // Inject Firebase auth service
  isSignIn$ = this.afAuth.idToken
    .pipe(
      map(token => token != null)
    )
  getUserData$ =
    this.afAuth.authState
  private apiService = inject(ApiService);

  // Sign in with Google
  signIn = () => {
    this.afAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then(() => {
        this.afAuth.idToken
          .pipe(
            take(1)
          )
          .subscribe({
            next: token => {
              this.apiService.setToken(token);
              dispatchEvent(new Event('signIn'));
            },
          })
      })
  }

  signOut = () => {
    this.afAuth
      .signOut()
      .then(() => {
        this.apiService.setToken(null);
        dispatchEvent(new Event('signOut'));
      })
  }
}
