import { Component, OnInit } from '@angular/core';
import { FsService } from '../../service/fs.service';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { AuthService } from 'src/app/auth/service/auth.service';
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {
  public name;
  public height;
  public weight;
  public age;
  public gender;
  public phoneNumber;
  public user;

  constructor(
    private fsService: FsService,
    private as: AuthService,
  ) { }
  ngOnInit(){
    this.user = this.fsService.getUserInfo();
  }

  ionViewWillEnter(){
    this.user = this.fsService.getUserInfo();
    console.log(this.user)
    
    
  }
  public logout() {
    this.as.logout();
  }

}
