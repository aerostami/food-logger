import { Component, OnInit } from '@angular/core';
import { FsService } from '../../../service/fs.service'
import { AuthService } from 'src/app/auth/service/auth.service';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  public user;
  public name;
  public height;
  public weight;
  public age;
  public gender;
  public phoneNumber;
  public diabetes;
  public hypertension;
  public lipids;
  public apnea;


  public ageHtml;
  public heightHtml;
  public genderHtml;
  public weightHtml;


  constructor(
    private fsService: FsService,
    private as: AuthService,
  ) { }

  ngOnInit() {
    this.makeAgeHtml();
    this.fsService.getUserInfo().subscribe((data)=>{
      this.name = data.userInfo.name;
      this.height = data.userInfo.height;
      this.weight = data.userInfo.weight;
      this.age = data.userInfo.age;
      this.gender = data.userInfo.gender;
      this.phoneNumber = data.userInfo.phoneNumber;
      this.diabetes = data.userInfo.diabetes;
      this.hypertension = data.userInfo.hypertension;
      this.lipids = data.userInfo.lipids;
      this.apnea = data.userInfo.apnea;

    });
  }

  public logForm(){
    var data = {
      userInfo: {
        name: this.name,
        height: this.height,
        weight: this.weight,
        age: this.age,
        gender: this.gender,
        phoneNumber: this.phoneNumber,
        diabetes: this.diabetes,
        hypertension: this.hypertension,
        lipids: this.lipids,
        apnea: this.apnea
      },
      isUserInfoLogged: true
    };
    this.fsService.logUserInfo(data);
}
public makeAgeHtml() {
  var htmlmid = '';
  for (let i=0;i<100;i++) {
    htmlmid +='<ion-select-option value="'+i+'"></ion-select-option>'
  }
  this.ageHtml = 
  `
  <ion-select value ="age">
  `
  +
  htmlmid
  +
  `
  </ion-select>
  `
}
public logout() {
  this.as.logout();
}


}
