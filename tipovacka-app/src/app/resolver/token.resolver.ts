import {Injectable} from '@angular/core';
import {map, Observable, take, tap} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {DataService} from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class UserTokenResolver {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private dataService: DataService,
  ) {
  }

  resolve(): Observable<boolean> {
    return this.angularFireAuth.idToken
      .pipe(
        take(1),
        tap(this.dataService.setToken),
        map(_ => true)
      )
  }
}
