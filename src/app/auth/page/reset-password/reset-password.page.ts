import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public emailAddress;
  constructor(
    private as: AuthService,
  ) { }

  ngOnInit() {
  }

  public resetPassWord(emailAddress: string) {
    this.as.ResetPasswordByEmail(emailAddress);
  }

}
