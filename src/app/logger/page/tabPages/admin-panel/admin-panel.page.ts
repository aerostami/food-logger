import { Component, OnInit } from '@angular/core';
import { FsService } from '../../../service/fs.service';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { AuthService } from 'src/app/auth/service/auth.service';
import {Health, HealthQueryOptions} from '@ionic-native/health/ngx';

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
  public diabetes;
  public hypertension;
  public lipids;
  public apnea;
  public user: any;
  public stepCount;
  public weightResult;
  public heightResult;

  constructor(
    private fsService: FsService,
    private as: AuthService,
    private health: Health
  ) {
      this.health.isAvailable()
          .then((available: boolean) => {
              console.log(available);
              console.log('hello');
              this.health.requestAuthorization([
                  'distance',
                  {
                      read: ['steps', 'height', 'weight']       // read only permission
                  }
              ])
                  .then(res => console.log('result catch' + res))
                  .catch(e => console.log('Inner error catch' + e));
          })
          .catch(e => console.log('Outer error catch' + e));
  }

  ngOnInit(){

    this.health.query(
        {
          startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          endDate: new Date(),
          dataType: 'steps',
          limit: 1000
        })
        .then(res => {
            const stepSum = res.reduce((a, b) => a + Number(b.value), 0);
            console.log('step result for the past 24hr is ' + stepSum + ' step(s)');
        })
        .catch(e => console.log('steps query' + e));

    this.health.query(
          {
              startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
              endDate: new Date(),
              dataType: 'height',
              limit: 1000
          })
          .then(res => {
              this.heightResult = res[0].value + ' m';
              console.log('height result is ' + this.heightResult);
          })
          .catch(e => console.log('height query' + e));

    this.health.query(
          {
              startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
              endDate: new Date(),
              dataType: 'weight',
              limit: 1000
          })
          .then(res => {
              this.weightResult = res[0].value + ' kg';
              console.log('weight result is ' + this.weightResult);
          })
          .catch(e => console.log('weight query' + e));
  }

  ionViewWillEnter(){
    this.user = this.fsService.getUserInfo();
  }
  public logout() {
    this.as.logout();
  }

}
