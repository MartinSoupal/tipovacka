import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider} from '@angular/fire/auth';
import {map, take} from 'rxjs';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isSignIn = new Promise((resolve) => {
    this.afAuth.idToken
      .pipe(take(1))
      .subscribe(
        token => {
          resolve(!!token)
        }
      )
  })
  isSignIn$ = this.afAuth.idToken
    .pipe(
      map(token => token != null)
    )
  getUserData$ =
    this.afAuth.authState

  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private dataService: DataService
  ) {
  }

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
              this.dataService.setToken(token);
              dispatchEvent(new Event('signIn'));
            },
          })
      })
  }

  signOut = () => {
    this.afAuth
      .signOut()
      .then(() => {
        this.dataService.setToken(null);
        dispatchEvent(new Event('signOut'));
      })
  }
}
