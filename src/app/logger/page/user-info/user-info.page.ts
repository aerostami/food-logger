import { Component, OnInit } from '@angular/core';
import { FsService } from '../../service/fs.service'
import { AuthService } from 'src/app/auth/service/auth.service';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  public name;
  public height;
  public weight;
  public age;
  public gender;
  public phoneNumber;

  constructor(
    private fsService: FsService,
    private as: AuthService,
  ) { }

  ngOnInit() {
  }
  public logForm(){
    var data = {
      userInfo: {
        name: this.name,
        height: this.height,
        weight: this.weight,
        age: this.age,
        gender: this.gender,
        phoneNumber: this.phoneNumber
      },
      isUserInfoLogged: true
    }
    this.fsService.logUserInfo(data);
}
public logout() {
  this.as.logout();
}


}
