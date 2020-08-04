import { Component, OnInit } from '@angular/core';
import { FsService } from '../../service/fs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public logtime;
  public foods;
  public foodNum: number;
  constructor(
      private fsService: FsService,
      private router: Router,
  ) {
    this.foods = this.fsService.getTodayFood();

  }

  ngOnInit() {
    console.log(this.foods);
    this.foods.subscribe(event => this.foodNum = event.length);

  }
  logout() {
    localStorage.setItem('username', null);
    var username = localStorage.getItem('username');
    console.log(username)
    this.router.navigate(['/','auth','login'])
  }

}
