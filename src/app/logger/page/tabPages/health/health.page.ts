import {Component, OnInit, ViewChild} from '@angular/core';
import {Health, HealthQueryOptions} from '@ionic-native/health/ngx';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-health',
  templateUrl: './health.page.html',
  styleUrls: ['./health.page.scss'],
})
export class HealthPage implements OnInit {
    doughnut: any;
    @ViewChild('doughnutChart') doughnutChart;
  public height;
  public currentHeight = 'No Data';
  stepcount = 'No Data';
  workouts = [];

  constructor(private health: Health) {
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
    createDoughnutChartSleep(){
        const doughnutSleep = document.getElementById('doughnutChartSleep');
        this.doughnutChart = new Chart(doughnutSleep, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        data: [7,8,5,7],
                    }]
            },
            options: {
                circumference: Math.PI,
                rotation: 1.0 * Math.PI,
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }
  ngOnInit() {
      this.createDoughnutChartSleep();
  }




}
