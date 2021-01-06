import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public email: string;
  public password: string;
  public registerForm: FormGroup;
  constructor(
    private toastController: ToastController,
    private as: AuthService,
    private router: Router,
    ) {
    

   }

  ngOnInit() {
  }
  


  public onSubmit() {

    var email = this.email;
    var password = this.password;
    this.as.SignUp(email, password);
    



  }

  

}
