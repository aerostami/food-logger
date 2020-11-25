import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../types/User.interface';
import { AuthService } from '../../service/auth.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: string;
  public password: string;

  validation = false;
  loginForm: FormGroup;
  item: Observable<User>;
  items: Observable<any[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private as: AuthService,

    ) { }
  ngOnInit() {
    const username = localStorage.getItem('username');
    
    if (username === null || username === 'null') {
      this.router.navigate(['/auth/login']);
    } else {
      this.as.pushUser();    
    }
  }


  onSubmit() {
   
    var email = this.email;
    var password = this.password;

    this.as.SignIn(email, password);


  }

  public GoogleAuth() {
    this.as.GoogleAuth()
    
  }

}
