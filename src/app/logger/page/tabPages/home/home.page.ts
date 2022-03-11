import { Component, OnInit, ViewChild} from '@angular/core';
import { FsService } from '../../../service/fs.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FoodEditPage } from '../../logPages/food-edit/food-edit.page';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Chart } from 'chart.js';
import { OpenModalService } from 'src/app/services/open-modal.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('barChart') barChart;
  @ViewChild('doughnutChart') doughnutChart;
  @ViewChild('doughnutChartSleep') doughnutChartSleep;

  bars: any;
  doughnut: any;
  doughnutSleep: any;
  doughnutWater: any;
  doughnutStress: any;
  antiInflammatoryVal = 'n';
  alleviatingMedsVal = 'n';

  colorArray: any;
  nutData = [0, 0, 0, 0];
  timeDistPM = [];
  colorDistPM = [];
  sleepDistColors = [];
  labelDistDoughPM = [];
  timeDistAM = [];
  sleepDist = [];
  waterDist = [];
  waterDistColors = [];
  stressDist = [];
  barChartDeselectedColor = 'rgb(107,101,95,0.43)';
  stressDistColors = [];
  colorDistAM = [];
  distMsgs = ['Daily intake time distribution'];
  labelDistDoughAM = [];
  hasNutritionalContent = false;

  public totalCals = 0;
  public logtime;
  public foods;
  public events;
  public  lastAntiInflammatoryService;
  public lastAlleviatingMedsService;
  public lastAntiInflammatoryVal;
  public lastAlleviatingMedsVal;

  public foodNum: number = 0;
  public eventNum: number;
  private triedRefresh = 0;
  constructor(
      private fsService: FsService,
      private as: AuthService,
      private openModalService: OpenModalService,
  ) {
    // this.drawCharts();
    /*
    this.foods = this.fsService.getTodayFood();
    this.events = this.fsService.getTodayEvent();
    this.lastAntiInflammatoryService = this.fsService.getTodayAntiInflammatory();
    this.lastAlleviatingMedsService = this.fsService.getTodayAlleviatingMeds();
    this.makeChart();
    */
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

  public async openFoodEditModal(data){
    this.openModalService.openFoodEditModal(data);
  }

  async  addChartsDelayed(){
    await new Promise(resolve => setTimeout(() => resolve(), 1000)).then( () => this.drawCharts());
  }
  ngOnInit() {
    this.triedRefresh = 0;
    this.drawCharts();
    // this.addChartsDelayed();
    // this.makeChart();
  }



  drawCharts() {
    localStorage.setItem('mode', 'food');
    this.foods = this.fsService.getTodayFood();
    this.events = this.fsService.getTodayEvent();
    this.lastAntiInflammatoryService = this.fsService.getTodayAntiInflammatory();
    this.lastAlleviatingMedsService = this.fsService.getTodayAlleviatingMeds();
    // console.log(document.getElementById('barChart'));

    this.makeChart();
    if (!document.getElementById('barChart') && (this.triedRefresh < 2 && (this.triedRefresh < 1 || this.foodNum !== 0))){

      // console.log('trying....', document.getElementById('barChart').getBoundingClientRect().width);
      this.triedRefresh += 1;
      this.addChartsDelayed();

    }


    // this.fsService.getUserInfo().subscribe((result)=>{
    //   if ( result.isUserInfoLogged == undefined ) {
    //     this.router.navigate(['/user-info'])
    //   } 
    // })
  }
  drawAlleMeds(){
    this.lastAlleviatingMedsService.subscribe(event => {
      let mostRecent = null;
      let mostRecentDate = 0;
      for ( let i = 0; i < event.length; i++) {
        const theTime = this.fsService.convertTimeStampToDate(event[i].date).getHours() + this.fsService.convertTimeStampToDate(event[i].date).getMinutes() / 60 + this.fsService.convertTimeStampToDate(event[i].date).getSeconds() / (60 * 60);
        if (theTime > mostRecentDate){
          mostRecentDate = theTime;
          mostRecent = event[i];

        }
        this.alleviatingMedsVal = mostRecent.level;
      }

    });
  }
  drawAntiflam(){
    this.lastAntiInflammatoryService.subscribe(event => {
      let mostRecent = null;
      let mostRecentDate = 0;
      for ( let i = 0; i < event.length; i++) {
        const theTime = this.fsService.convertTimeStampToDate(event[i].date).getHours() + this.fsService.convertTimeStampToDate(event[i].date).getMinutes() / 60 + this.fsService.convertTimeStampToDate(event[i].date).getSeconds() / (60 * 60);
        if (theTime > mostRecentDate){
          mostRecentDate = theTime;
          mostRecent = event[i];
        }
        this.antiInflammatoryVal = mostRecent.level;
      }
      this.drawAlleMeds();
    });
  }
  drawEvents(){
    this.events.subscribe(event => {

      this.sleepDist.length = 0;
      this.stressDist.length = 0;
      this.eventNum = event.length;
      let sleepQualities = 0;
      let stressAvg = 0;
      let countSleep = 0;
      let countStress = 0;

      for ( let i = 0; i < event.length; i++) {
        if (event[i].type === 'Sleep'){

          sleepQualities += event[i].level;
          countSleep += 1;
        }else if (event[i].type === 'Stress'){

          stressAvg += event[i].level;
          countStress += 1;
        }
      }
      // sleep
      if (sleepQualities){
        sleepQualities = sleepQualities / countSleep;
      }

      this.sleepDistColors = ['rgb(36,64,101)', this.barChartDeselectedColor];
      /*
      if (sleepQualities < 1){
        this.sleepDistColors[0] = 'rgb(107,101,95,0.6)';
      }else if (sleepQualities < 2) {
        this.sleepDistColors[0] = 'rgb(107,101,95,0.6)';
      }else if (sleepQualities < 3) {
        this.sleepDistColors[0] = 'rgb(107,101,95,0.6)';
      }else if (sleepQualities < 4) {
        this.sleepDistColors[0] = 'rgb(107,101,95,0.6)';
      }
      */
      if (sleepQualities === 0){
        sleepQualities = 0.2;
        this.sleepDistColors[1] =this.barChartDeselectedColor;
      }
      this.sleepDist = [sleepQualities, 5 - sleepQualities];
      if (countSleep === 0){
        this.sleepDist = [0, 5];
        this.sleepDistColors = ['rgb(255,255,255)', this.barChartDeselectedColor];
      }
      this.createDoughnutChartSleep();
      // stress
      if (stressAvg){
        stressAvg = stressAvg / countStress;
      }
      this.stressDistColors = ['rgb(218,115,101)', this.barChartDeselectedColor];
      if (stressAvg < 1){
        this.stressDistColors = ['rgb(61,114,98)', this.barChartDeselectedColor];
      }else if (stressAvg < 2) {
        this.stressDistColors = ['rgb(92,113,97)', this.barChartDeselectedColor];
      }else if (stressAvg < 3) {
        this.stressDistColors = ['rgb(105,116,96)', this.barChartDeselectedColor];
      }else if (stressAvg < 4) {
        this.stressDistColors = ['rgb(169,114,96)', this.barChartDeselectedColor];
      }
      if (stressAvg === 5){
        stressAvg = 4.8;
      }
      this.stressDist = [stressAvg, 5 - stressAvg];
      if (countStress === 0){
        this.stressDist = [0, 5];
        this.stressDistColors = ['rgb(255,255,255)', this.barChartDeselectedColor];
      }
      this.createDoughnutChartStress();
      this.drawAntiflam();
    });

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
      let waterAmount = 0;
      for (let i = 0; i < event.length; i++) {
        if (event[i].food.serving_unit === 'serving 8 fl oz'){
          waterAmount += event[i].amount;
        }
        let theTime = this.fsService.convertTimeStampToDate(event[i].date).getHours() + this.fsService.convertTimeStampToDate(event[i].date).getMinutes() / 60;
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

      this.waterDistColors = ['rgb(67,149,160)', this.barChartDeselectedColor];
      if (waterAmount > 12){
        waterAmount = 12;
      }
      this.waterDist = [waterAmount, 12 - waterAmount];
      this.createDoughnutChartWater();

      this.nutData = [+this.nutData[0].toFixed(2), +this.nutData[1].toFixed(2), +this.nutData[2].toFixed(2), +this.nutData[3].toFixed(2)];
      times.sort((a, b) => (a.time > b.time) ? 1 : -1);
      let lateMeal = false;
      let startedSleep = true;
      if (times.length > 0 && times[0].time < 4){
        lateMeal = true;
        startedSleep = false;
      }

      const currentDate = new Date();
      let curTime = currentDate.getHours() + currentDate.getMinutes() / 60;
      curTime = +curTime.toFixed(2);
      //
      //

      this.distMsgs = ['Daily intake time distribution'];

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
              this.colorDistAM.push('rgb(226,120,73)');
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
          this.colorDistAM.push('rgb(226,120,73)');
          this.labelDistDoughAM.push('Digesting');
        }
        if (end !== 24){
          this.timeDistAM.push( +(24 - end).toFixed(2));
          this.colorDistAM.push(this.barChartDeselectedColor);
          this.labelDistDoughAM.push('later...');
        }
      }
      /*
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
      */

      if (!(this.nutData[0] === 0 && this.nutData[1] === 0 && this.nutData[2] === 0 && this.nutData[3] === 0 ) && document.getElementById('barChart')){
        this.createBarChart();
        var bar = document.getElementById('barChart');

        // bar.setAttribute('height', bar.getAttribute('width'));
        // bar.style.height = bar.style.width;
        // console.log('barChartAfter: ', bar);
      }else{
        // console.log('Nothing to draw, nutData: ', this.nutData, 'barChart: ', document.getElementById('barChart'));
      }
      this.createDoughnutChart();
      this.drawEvents();
      // if (this.nutData[0] + this.nutData[1] + this.nutData[2] + this.nutData[3] > 0){
      //   this.hasNutritionalContent = true;
      //   this.createBarChart();
      // }else{
      //   this.hasNutritionalContent = false;
      // }
      // if (this.timeDistAM.length > 2){
      //   this.createDoughnutChart();
      // }
    });
  }
  public refresh(event){
    this.drawCharts();
    setTimeout(() => {
      // console.log('Async operation has ended');
      event.target.complete();
    }, 700);
  }


  async antiInflammatoryChanged(event){
      const currentDate = new Date();
      const data = {type: 'antiInflammatory', date: currentDate, level: event.detail.value};
      this.fsService.logAntiInflammatory(data, currentDate);
      /*
      this.fsService.logEvent(data, currentDate);
      // localStorage.setItem("events",JSON.stringify(this.logfoods));
      this.router.navigate(['/logger/home']);
      await new Promise(resolve => setTimeout(() => resolve(), 200)).then( () => this.hp.drawCharts()
      */
  }

  async alleviatingmedsChanged(event){
    const currentDate = new Date();
    const data = {type: 'alleviatingMeds', date: currentDate, level: event.detail.value};
    this.fsService.logAlleviatingMeds(data, currentDate);
  }
  
  public deletefood(id: any, date: any) {
    var formatted_date = date.toDate();
    this.fsService.deleteItem(id, formatted_date);
    this.drawCharts();
  }

  public deleteEvent(id: any, date: any) {
    var formatted_date = date.toDate();
    this.fsService.deleteItemEvent(id, formatted_date);
  }
/*
  createDoughnutChartOld(){
    let doughnut = document.getElementById('doughnutChart');
    this.doughnut = new Chart(doughnut, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.timeDistAM,
            backgroundColor: this.colorDistAM,
            label: 'AM',
            labels: this.labelDistDoughAM
          }]
      },
      options: {
        responsive: false,
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
          text: this.distMsgs,
          position: 'bottom'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
*/
  createDoughnutChart(){
    let doughnut = document.getElementById('doughnutChart');
    this.doughnut = new Chart(doughnut, {
      type: 'doughnut',
      data: {
        datasets: [
          {
          data: this.timeDistAM,
          backgroundColor: this.colorDistAM, labels: this.labelDistDoughAM
        }]
      },
      options: {
        circumference: Math.PI,
        rotation: 1.0 * Math.PI,
        animation: {
          animateScale: true,
          animateRotate: true
        }
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
        text: this.distMsgs,
        position: 'bottom'
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    });
  }

  createDoughnutChartSleep(){
    const doughnutSleep = document.getElementById('doughnutChartSleep');
    this.doughnutSleep = new Chart(doughnutSleep, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.sleepDist,
            backgroundColor: this.sleepDistColors
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

  createDoughnutChartWater(){
    const doughnutWater = document.getElementById('doughnutChartWater');
    this.doughnutWater = new Chart(doughnutWater, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.waterDist,
            backgroundColor: this.waterDistColors
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

  createDoughnutChartStress(){
    const doughnutStress = document.getElementById('doughnutChartStress');
    // console.log(doughnutStress);
    this.doughnutStress = new Chart(doughnutStress, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.stressDist,
            backgroundColor: this.stressDistColors
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
    // console.log(doughnutStress);
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
            'rgb(212,77,57)',
            'rgb(239,215,180)',
            'rgb(230,174,122)',// (237,174,123), (231,123,77), 234,143,100
            'rgb(57,123,151)'
          ],
        }]
      },
      options: {
        legend: {
          position: 'left',
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
    const zdate = this.fsService.convertTimeStampToDate(timestamp);
    let ret = [zdate.getHours() , zdate.getMinutes() , 'AM'];
    if (ret[0] > 12){
      ret[0] = ret[0] - 12;
      ret[2] = 'PM';
    }
    if (ret[0] === 12){
      ret[2] = 'pm';
    }
    ret = [ret[0] + '', ret[1] + '' , ret[2]];
    /*
    if (ret[0].length === 1){
      ret[0] = '0' + ret[0];
    }
    if (ret[1].length === 1){
      ret[1] = '0' + ret[1];
    }
     */
    return ret[0] + ' : ' + ret[1] + ' ' + ret[2];
  }

}
