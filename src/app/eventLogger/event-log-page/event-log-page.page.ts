import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FsService } from '../../logger/service/fs.service';

@Component({
  selector: 'app-event-log-page',
  templateUrl: './event-log-page.page.html',
  styleUrls: ['./event-log-page.page.scss'],
})
export class EventLogPagePage implements OnInit {
  public type = 'Stress';
  public date = new Date().toISOString();
  public level = 2;
  constructor(    private fsService: FsService,
                  private router: Router) { }

  ngOnInit() {

  }

  logEvent(){
    const currentDate = new Date(this.date);
    const data = {type: this.type, date: currentDate, level: this.level};

    this.fsService.logEvent(data, currentDate);
    // localStorage.setItem("events",JSON.stringify(this.logfoods));
    this.router.navigate(['/logger/home']);
  }
}
