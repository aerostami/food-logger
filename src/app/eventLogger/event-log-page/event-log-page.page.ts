import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FsService } from '../../logger/service/fs.service';
import {HomePage} from 'src/app/logger/page/tabPages/home/home.page';

@Component({
  selector: 'app-event-log-page',
  templateUrl: './event-log-page.page.html',
  styleUrls: ['./event-log-page.page.scss'],
  providers: [HomePage],
})
export class EventLogPagePage implements OnInit {
  public type = 'Sleep';
  public date = new Date().toISOString();
  public level = 2;
  constructor(    private fsService: FsService,
                  private router: Router,
                  private hp: HomePage ) { }

  ngOnInit() {

  }

  async logEvent(){
    const currentDate = new Date(this.date);
    const data = {type: this.type, date: currentDate, level: this.level};

    this.fsService.logEvent(data, currentDate);
    // localStorage.setItem("events",JSON.stringify(this.logfoods));
    this.router.navigate(['/logger/home']);

    await new Promise(resolve => setTimeout(() => resolve(), 200)).then( () => this.hp.drawCharts());
  }
}
