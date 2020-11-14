import { Component, OnInit, ViewChild } from '@angular/core';
import { FsService } from '../../service/fs.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FoodEditPage } from '../food-edit/food-edit.page';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('barChart') barChart;
  @ViewChild('doughnutChart') doughnutChart;
  @ViewChild('doughnutChartPM') doughnutChartPM;

  bars: any;
  doughnut: any;
  doughnutPM: any;


  colorArray: any;
  nutData = [0, 0, 0, 0];
  timeDistPM = [];
  colorDistPM = [];
  labelDistDoughPM = [];
  timeDistAM = [];
  colorDistAM = [];
  distMsgs = ['Daily intake time distribution'];
  labelDistDoughAM = [];

  public totalCals = 0;
  public logtime;
  public foods;
  public foodNum: number;
  constructor(
      private fsService: FsService,
      private router: Router,
      private as: AuthService,
      private modalController: ModalController
  ) {
    

  }

  barcodescan(){
    /*
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });
     */
  }

  public async openFoodEditModal(food){
    const modal = await this.modalController.create({
      component: FoodEditPage,
      componentProps: {
        "food": food,
        "foods": this.foods
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // this.dataReturned = dataReturned.data;
        // console.log(this.dataReturned);
        // alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }

  ngOnInit() {

  }


  ionViewWillEnter() {
    localStorage.setItem('mode', 'food')
    var mode = localStorage.getItem('mode')
    console.log(mode)
    var userid = localStorage.getItem('username');

    this.foods = this.fsService.getTodayFood();
    var username = localStorage.getItem('username');
    this.fsService.getUserInfo().subscribe((result)=>{
      if ( result.isUserInfoLogged == undefined ) {
        this.router.navigate(['/user-info'])
      } 
    })
    this.makeChart();
    
   

  }

  public makeChart() {
    this.foods.subscribe(event => {
      let times = [];
      this.foodNum = event.length;
      this.nutData = [0, 0, 0, 0];
      this.timeDistPM.length = 0;
      this.colorDistPM.length = 0;
      this.labelDistDoughPM.length = 0;
      this.timeDistAM.length = 0;
      this.colorDistAM.length = 0;
      this.labelDistDoughAM.length = 0;
      this.totalCals = 0;
      const dur = 0.5;


      // console.log('events');
      // console.log(event);
      for (let i = 0; i < event.length; i++) {
        let theTime = this.convertTimeStampToDate(event[i].date).getHours() + this.convertTimeStampToDate(event[i].date).getMinutes() / 60;
        if (12 > theTime && theTime > 12 - dur){
          theTime = 12 - dur;
        }
        if (24 > theTime && theTime > 24 - dur){
          theTime = 24 - dur;
        }
        theTime = +theTime.toFixed(2);
        times.push({time: theTime, food: event[i].food.food_name});
        if (event[i].food.nf_calories){
          this.totalCals += event[i].food.nf_calories * event[i].amount;
          this.totalCals = +this.totalCals.toFixed(2);
        }
        if (event[i].food.nf_protein){
          this.nutData[0] += (event[i].food.nf_protein * 4 ) / event[i].food.nf_calories * 100  * event[i].amount;
        }
        if (event[i].food.nf_sugars) {
          this.nutData[1] += (event[i].food.nf_sugars * 4) / event[i].food.nf_calories * 100  * event[i].amount;
        }
        if (event[i].food.nf_total_carbohydrate) {
          this.nutData[2] += (event[i].food.nf_total_carbohydrate * 4) / event[i].food.nf_calories * 100  * event[i].amount;
        }
        if (event[i].food.nf_total_fat) {
          this.nutData[3] += (event[i].food.nf_total_fat * 9) / event[i].food.nf_calories * 100  * event[i].amount;
        }
      }
      this.nutData = [+this.nutData[0].toFixed(2), +this.nutData[1].toFixed(2), +this.nutData[2].toFixed(2), +this.nutData[3].toFixed(2)];
      times.sort((a, b) => (a.time > b.time) ? 1 : -1);
      let lateMeal = false;
      let startedSleep = true;
      if (times.length > 0 && times[0].time < 4){
        lateMeal = true;
        startedSleep = false;
      }
      console.log(times);
      const currentDate = new Date();
      let curTime = currentDate.getHours() + currentDate.getMinutes() / 60;
      curTime = +curTime.toFixed(2);
      //
      //

      this.distMsgs = ['Daily intake time distribution'];
      /*
      // single cycle
      let lastTime = -1 * dur;
      for (let i = 0; i < times.length; i++) {
        if (times[i].time <= curTime){
          if ((times[i].time - lastTime) > dur){
            if (lastTime < 0){
              lastTime = 0;
            }
            const diff = +(times[i].time - lastTime).toFixed(2);
            this.timeDistAM.push(diff);
            if (!startedSleep){ // Go to bed!
              this.colorDistAM.push('rgb(197,199,192)');
              this.labelDistDoughAM.push('Digesting');
              if (curTime - times[i].time < 3){
                if (this.distMsgs.length === 1){
                  this.distMsgs.push('Go to bed!');
                }else {
                  this.distMsgs[1] = 'Go to bed!';
                }
              }
            } else{
              this.colorDistAM.push('rgb(143,210,132)');
              this.labelDistDoughAM.push('Fasting');
              startedSleep = false;
              if (curTime - times[i].time < 3){
                if (this.distMsgs.length === 1){
                  this.distMsgs.push('Good morning!');
                }else {
                  this.distMsgs[1] = 'Good morning!';
                }
              }
            }

            this.timeDistAM.push(dur);
            this.colorDistAM.push('rgb(178,44,0)');
            this.labelDistDoughAM.push(times[i].food);

          } else { // group with last one
            this.labelDistDoughAM[this.labelDistDoughAM.length - 1] = [this.labelDistDoughAM[this.labelDistDoughAM.length - 1] ,
              times[i].food];
          }
          lastTime = times[i].time;
        }
      }
      if ((24 - lastTime) > dur){
        let end = 24;
        if (24 > curTime){
          end = curTime;
        }
        this.timeDistAM.push( +(end - lastTime).toFixed(2));
        if (this.timeDistAM.length <= 0 || (this.timeDistAM.length <= 1 && lateMeal) ){
          this.colorDistAM.push('rgb(143,210,132)');
          this.labelDistDoughAM.push('Fasting');
        } else{
          this.colorDistAM.push('rgb(197,199,192)');
          this.labelDistDoughAM.push('Digesting');

        }
        if (end !== 24){
          this.timeDistAM.push( +(24 - end).toFixed(2));
          this.colorDistAM.push('rgb(255,255,255)');
          this.labelDistDoughAM.push('later...');
        }
      }
       */
      // AM:
      let lastTime = -0.5;
      for (let i = 0; i < times.length; i++) {
        if (times[i].time < 12 && times[i].time <= curTime){
          if ((times[i].time - lastTime) > dur){
            if (lastTime < 0){
              lastTime = 0;
            }
            const diff = +(times[i].time - lastTime).toFixed(2);
            this.timeDistAM.push(diff);
            if (!startedSleep){ // Go to bed!
              this.colorDistAM.push('rgb(197,199,192)');
              this.labelDistDoughAM.push('Digesting');
              if (curTime - times[i].time < 3){
                if (this.distMsgs.length === 1){
                  this.distMsgs.push('Go to bed!');
                }else {
                  this.distMsgs[1] = 'Go to bed!';
                }
              }
            } else{
              this.colorDistAM.push('rgb(143,210,132)');
              this.labelDistDoughAM.push('Fasting');
              startedSleep = false;
              if (curTime - times[i].time < 3){
                if (this.distMsgs.length === 1){
                  this.distMsgs.push('Good morning!');
                }else {
                  this.distMsgs[1] = 'Good morning!';
                }
              }
            }

            this.timeDistAM.push(dur);
            this.colorDistAM.push('rgb(178,44,0)');
            this.labelDistDoughAM.push(times[i].food);

          } else { // group with last one
            this.labelDistDoughAM[this.labelDistDoughAM.length - 1] = [this.labelDistDoughAM[this.labelDistDoughAM.length - 1] ,
              times[i].food];
          }
          lastTime = times[i].time;
        }
      }
      if ((12 - lastTime) > dur){
        let end = 12;
        if (12 > curTime){
          end = curTime;
        }
        this.timeDistAM.push( +(end - lastTime).toFixed(2));
        if (this.timeDistAM.length === 1){
          this.colorDistAM.push('rgb(143,210,132)');
          this.labelDistDoughAM.push('Fasting');
        }else{
          this.colorDistAM.push('rgb(197,199,192)');
          this.labelDistDoughAM.push('Digesting');
        }

        if (end !== 12){
          this.timeDistAM.push( +(12 - end).toFixed(2));
          this.colorDistAM.push('rgb(255,255,255)');
          this.labelDistDoughAM.push('later...');
        }
      }
      //
      //
      // console.log('##');
      // console.log(this.timeDistAM);
      // PM
      let isFasting = false;
      if (1 >= this.timeDistAM.length){
        isFasting = true;
      }
      // console.log(isFasting);
      lastTime = 11.5;
      for (let i = 0; i < times.length; i++) {
        if (times[i].time >= 12 && times[i].time <= curTime) { // if PM
          if ((times[i].time - lastTime) >= dur) { // has enough space
            if (lastTime < 12){
              lastTime = 12;
            }
            // blank, digesting
            const diff = +(times[i].time - lastTime).toFixed(2);
            this.timeDistPM.push(diff);
            if (isFasting){
              this.colorDistPM.push('rgb(143,210,132)');
              this.labelDistDoughPM.push('Fasting');
              isFasting = false;
              if (curTime - times[i].time < 3){
                if (this.distMsgs.length === 1){
                  this.distMsgs.push('Busy day hah?');
                }else {
                  this.distMsgs[1] = 'Busy day hah?';
                }
              }
            }else{
              this.colorDistPM.push('rgb(197,199,192)');
              this.labelDistDoughPM.push('Digesting');
              if (curTime - times[i].time < 3){
                if (this.distMsgs.length === 1){
                  this.distMsgs.push('That ' + times[i].food + ' was yum!');
                }else {
                  this.distMsgs[1] = 'That ' + times[i].food + ' was yum!';
                }
              }
            }

            // new item
            this.timeDistPM.push(dur);
            this.colorDistPM.push('rgb(178,44,0)');
            this.labelDistDoughPM.push(times[i].food);
          } else { // group with last one
            this.labelDistDoughPM[this.labelDistDoughPM.length - 1] = [this.labelDistDoughPM[this.labelDistDoughPM.length - 1] ,
              times[i].food];
          }
          lastTime = times[i].time;
        }
      }
      if ((24 - lastTime) > dur && lastTime !== 11.5){
        let end = 24;
        if (24 > curTime){
          end = curTime;
        }
        this.timeDistPM.push( +(end - lastTime).toFixed(2));
        if (this.timeDistPM.length <= 1 && (this.timeDistAM.length <= 1 || (this.timeDistAM.length <= 2 && lateMeal) )){
          this.colorDistPM.push('rgb(143,210,132)');
          this.labelDistDoughPM.push('Fasting');
        } else{
          this.colorDistPM.push('rgb(197,199,192)');
          this.labelDistDoughPM.push('Digesting');

        }
        if (end !== 24){
          this.timeDistPM.push( +(24 - end).toFixed(2));
          this.colorDistPM.push('rgb(255,255,255)');
          this.labelDistDoughPM.push('later...');
        }

      }

      this.createBarChart();
      this.createDoughnutChart();
    });
  }
  
  refresh(event){
    this.ionViewWillEnter();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  
  
  deletefood(id: any, date: any) {
    var formatted_date = date.toDate();
    this.fsService.deleteItem(id, formatted_date);
  }

  

  createDoughnutChart(){
    const doughnutPM = document.getElementById('doughnutChartPM');
    this.doughnutPM = new Chart(doughnutPM, {
      type: 'doughnut',
      data: {
        datasets: [
          {
        data: this.timeDistPM,
        backgroundColor: this.colorDistPM,
        label: 'PM',
        labels: this.labelDistDoughPM
      }]
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var index = tooltipItem.index;
              return dataset.labels[index];
            }
          }
        },
        title: {
          display: true,
          text: 'PM distribution', // this.distMsgs,
          position: 'bottom'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
    const doughnut = document.getElementById('doughnutChart');
    this.doughnut = new Chart(doughnut, {
      type: 'doughnut',
      data: {
        datasets: [
            /*{
          data: this.timeDistPM,
          backgroundColor: this.colorDistPM,
          label: 'PM',
          labels: this.labelDistDoughPM
        }, */{
          data: this.timeDistAM,
          backgroundColor: this.colorDistAM,
          label: 'AM',
          labels: this.labelDistDoughAM
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var index = tooltipItem.index;
              return dataset.labels[index];
            }
          }
        },
        title: {
          display: true,
          text: 'AM distribution', // this.distMsgs,
          position: 'bottom'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }

  createBarChart() {
    var bar = document.getElementById('barChart');
    this.bars = new Chart(bar, {
      type: 'pie',
      data: {
        labels: ['protein', 'sugar', 'carb', 'fat'],
        datasets: [{
          label: 'g',
          data: this.nutData,
          backgroundColor: [
            'rgb(194,92,3)',
            'rgb(0,120,194)',
            'rgb(40,194,12)',
            'rgb(233,238,0)'
          ],
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'left',
        },
        title: {
          display: true,
          text: 'Daily nutritional breakdown',
          position: 'bottom'
        }
      }
    });
  }

  public reload() {
    location.reload();
  }

  public logout() {
    this.as.logout();
  }

  public convertTimeStampToDate(timestamp) {
    return timestamp.toDate();
  }

}
