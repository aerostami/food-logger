import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public username: string;
  public password: string;
  public registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private as: AuthService,
    ) {
    

   }

  ngOnInit() {
  }
  


  public onSubmit() {
    var username = this.username;
    var password = this.password;
    this.as.register(username, password);


  }


}
