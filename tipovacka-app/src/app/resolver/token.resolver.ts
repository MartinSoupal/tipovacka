import {inject, Injectable} from '@angular/core';
import {map, Observable, take, tap} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ApiService} from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserTokenResolver {
  private angularFireAuth = inject(AngularFireAuth);
  private apiService = inject(ApiService);


  resolve(): Observable<boolean> {
    return this.angularFireAuth.idToken
      .pipe(
        take(1),
        tap(this.apiService.setToken),
        map(_ => true)
      )
  }
}
