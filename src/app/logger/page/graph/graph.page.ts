import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.page.html',
  styleUrls: ['./graph.page.scss'],
})
export class GraphPage implements OnInit {
  @ViewChild('barChart') barChart;
  @ViewChild('doughnutChart') doughnutChart;

  bars: any;
  doughnut: any;
  constructor() { }

  ngOnInit() {
  }

}
