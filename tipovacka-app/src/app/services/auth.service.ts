import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider} from '@angular/fire/auth';
import {map, take} from 'rxjs';

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
  private token: string | null = null;

  constructor(
    private afAuth: AngularFireAuth // Inject Firebase auth service
  ) {
  }

  // Sign in with Google
  signIn = () =>
    this.afAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then(() => {
        this.afAuth.idToken
          .pipe(
            take(1)
          )
          .subscribe(
            token => {
              this.token = token;
            }
          )
      })


  signOut = () => {
    this.afAuth
      .signOut()
      .then(() => {
        this.token = null;
      })
  }
}
