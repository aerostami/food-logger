import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FsService } from '../../logger/service/fs.service';

@Component({
  selector: 'app-survey-log',
  templateUrl: './survey-log.page.html',
  styleUrls: ['./survey-log.page.scss'],
})
export class SurveyLogPage implements OnInit {
  public ans = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  public hash = ['Strongly agree         ', 'Somewhat agree     ', 'Neutral                    ', 'Somewhat disagree', 'Strongly disagree    '];
  constructor(    private fsService: FsService,
                  private router: Router) { }

  ngOnInit() {
  }
  report(){
    // const currentDate = new Date(this.date);
    // const data = {type: this.type, date: currentDate, level: this.level};

    // this.fsService.logEvent(data, currentDate);
    // localStorage.setItem("events",JSON.stringify(this.logfoods));
    this.router.navigate(['/logger/home']);
  }
}
