import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { User } from '../../types/User.interface';
import { Observable, Subject} from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Platform, ToastController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private UserLoginStream = new Subject<any>();
  private usersCollection: AngularFirestoreCollection<User>;
  items: Observable<any[]>;
  private user;
  uid: any;
  constructor(
    private fs: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private toastController: ToastController,
    private platform: Platform,
    private gplus: GooglePlus,
    ) {
      this.user = this.afAuth.authState;
    
      this.usersCollection = this.fs.collection('users')
      this.items = this.usersCollection.snapshotChanges().pipe(
        map(action => action.map( a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data};
        }))
      );
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
      

      this.router.navigate(['/logger/home']);

      this.SetUserData(result.user);
    }).catch(error => {
      var errorMessage = error.message;
      this.startToast(errorMessage);
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
    if (this.platform.is('capacitor')) {
      let params = {
        webClientId: '1055247824931-u6mk1f7d4hftp6kob1nlgpc0knv9jo12.apps.googleusercontent.com', 
        offline: true
      };
      this.gplus.login(params)
      .then((response) => {

        const { idToken, accessToken } = response;
        this.onLoginSuccess(idToken, accessToken);
      }).catch ((error) =>
        alert('error: test' + error)
      );
      
    } else {
      return this.AuthLogin(new auth.GoogleAuthProvider());
    }
    return;
  }
  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : auth.GoogleAuthProvider
            .credential(accessToken);
    this.afAuth.signInWithCredential(credential)
      .then((success) => {
        this.SetUserData(success.user);

        this.router.navigate(['/logger/home']);

      });

  }

  async AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {      
      this.SetUserData(result.user);

      this.router.navigate(['/logger/home']);

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

  async checkWaterData() {
    // const usersDoc = this.fs.firestore.collection(`users`);
    // usersDoc.get().then((userQuerySnapshot) => {
    //   userQuerySnapshot.forEach((user) => {
    //     const userLogDoc = usersDoc.doc(user.id).collection('20210209');
    //     userLogDoc.get().then((menuQuerySnapshot) => {
    //       menuQuerySnapshot.forEach((menu) => {
    //         console.log(menu.id, '=>', menu.data());
    //       });
    //     });
    //     // console.log(doc.id, '=>', doc.data());
    //   });
    // });
    let flag = false;
    await this.afAuth.authState.subscribe( async authState => {
      // set doc path(ex. USER_UID)
      this.uid = authState.uid;

      // set collection path(ex. 20201225)
      const currentDate = new Date().toLocaleDateString();
      const dateElements = currentDate.split('/');
      const year = dateElements[2];
      let month = dateElements[0];
      let date = dateElements[1];

      if (month.length === 1) {
        month = '0' + month;
      }
      if (date.length === 1) {
        date = '0' + date;
      }
      const collectionPath = year + month + date;

      const userDoc = this.fs.firestore.collection('users').doc(this.uid).collection(collectionPath);
      await userDoc.get().then((doc) => {
        doc.forEach((food) => {
          if (food.data().food.food_name === 'water') {
            flag = true;
            return flag;
          } else {
            return flag;
          }
        });
      });
    });
    return flag;
  }

  async getUserData() {
    let data;
    await this.afAuth.authState.subscribe(async authState => {
      this.uid = authState.uid;
      const currentDate = new Date().toLocaleDateString();
      const dateElements = currentDate.split('/');
      const year = dateElements[2];
      let month = dateElements[0];
      let date = dateElements[1];

      if (month.length === 1) {
        month = '0' + month;
      }
      if (date.length === 1) {
        date = '0' + date;
      }
      const collectionPath = year + month + date;
      const userDoc = this.fs.firestore.collection('users').doc(this.uid).collection(collectionPath);
      await userDoc.get().then((doc) => {
        doc.forEach((food) => {
          data = food.data();
          return data;
        });
      });
    });
    return data;
  }
}
