import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from 'firebase/app';
import { User } from '../../types/User.interface'
import { Observable, Subject} from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

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
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private toastController:ToastController,
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
    this.router.navigate(['/logger/home']);
    
  }

  public register (username: string, password: string) {
    const id = username;
    this.usersCollection.doc(id).set({'password': password});
  }

  public logout () {

    localStorage.removeItem('username');
    this.router.navigate(['/','auth','login'])
  }

  public SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then((result) => {
      
      this.ngZone.run(() => {
        this.router.navigate(['/logger/home']);
      });
      this.SetUserData(result.user);
    })
  }

  
  public SignUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then((result) => {

      this.SetUserData(result.user);
      this.startToast('Registration Successful');
      this.router.navigate(['/auth/login']);
    
    }).catch((error)=>{
      var errorCode = error.code;
      var errorMessage = error.message;
      this.startToast(errorMessage);
    })

  }

  
  public GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  public AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {

      
      this.SetUserData(result.user);
      this.ngZone.run(() => {
        this.router.navigate(['/logger/home']);
      })
    }).catch((error) => {
      window.alert(error)
    })
  }

  public SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.fs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      
    };
    localStorage.setItem('username', user.uid);
    this.UserLoginStream.next(user.uid);
    return userRef.set(userData, {
      merge: true
    })
  }
  public ResetPasswordByEmail(emialAddress: string) {

    this.afAuth.sendPasswordResetEmail(emialAddress).then(()=>{
      this.startToast('Successful send');
      this.router.navigate(['auth/login']);
    }).catch((error)=>{
      this.startToast(error);
    });
    


  }
  async startToast(message:string){
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      message: message,
    });

    await toast.present();
  }
  
}
