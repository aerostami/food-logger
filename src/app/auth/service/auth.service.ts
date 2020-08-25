import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../../types/User.interface'
import { Observable, Subject} from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private UserLoginStream = new Subject<any>();
  private usersCollection: AngularFirestoreCollection<User>;
  items: Observable<any[]>;
  constructor(
    private fs: AngularFirestore,
    private router: Router,
    ) {
    this.usersCollection = this.fs.collection('users')
    this.items = this.usersCollection.snapshotChanges().pipe(
      map(action => action.map( a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data};
      }))
    )
  }
  public getUserLoginStream (): Observable<any>{
    return this.UserLoginStream.asObservable();
  }
  public login (username: string, password: string) {
    this.items.forEach(item => item.forEach(v => {
      if (v.id === username) {
        if(v.password === password) {
          localStorage.setItem('username', username);
          this.UserLoginStream.next(username);
          this.router.navigate(['/logger/home']);
          return true;
        }
      }
    }));
  }
  public pushUser () {
    var username = localStorage.getItem('username');
    this.UserLoginStream.next(username);
  }

  public register (username: string, password: string) {
    const id = username;
    this.usersCollection.doc(id).set({'password': password});
  }

  public logout () {

    localStorage.removeItem('usermame');
    this.UserLoginStream.next
  }
}
