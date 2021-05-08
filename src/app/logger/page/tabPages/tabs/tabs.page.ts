import { Component, OnInit } from '@angular/core';
import {HomePage} from 'src/app/logger/page/tabPages/home/home.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  providers: [HomePage]
})
export class TabsPage implements OnInit {

  constructor(private hp: HomePage) { }

  ngOnInit() {

  }

  clickedHome(){
    localStorage.setItem('mode', 'food');
    this.hp.drawCharts();
  }

}
