import { Component, OnInit, ViewChild } from '@angular/core';
import { FsService } from '../../service/fs.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {FoodEditPage} from '../food-edit/food-edit.page';
import { AuthService } from 'src/app/auth/service/auth.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('pieChart') pieChart;
  @ViewChild('doughnutChart') doughnutChart;

  bars: any;
  doughnuts: any;
  colorArray: any;

  
  public logtime;
  public foods;
  public foodNum: number;
  constructor(
      private fsService: FsService,
      private router: Router,
      private as: AuthService,
      public modalController: ModalController
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
    this.foods = this.fsService.getTodayFood();
    var username = localStorage.getItem('username');
    
    this.foods.subscribe(event => this.foodNum = event.length);
    this.createPieChart();
    this.createDoughnutChart();
    
  }
  
  logout() {
    this.as.logout();
    
  }
  
  deletefood(id: any, date: any) {
    var formatted_date = date.toDate();
    this.fsService.deleteItem(id, formatted_date);
  }

  createDoughnutChart(){
    this.doughnuts = new Chart(this.doughnutChart.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'PM',
          backgroundColor: [
            'rgb(220,220,200)',
            'rgb(0,189,9)',
            'rgb(220,131,121)'],
          data: [8, 1 , 3],// array should have same number of elements as number of dataset
          // borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          // borderWidth: 1
        }, {
          data: [1, 6, 1, 4],
          backgroundColor: [
            'rgb(0,183,218)',
            'rgb(220,131,121)',
            'rgb(237,0,81)',
            'rgb(220,220,200)',
          ],
          label: 'AM',
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Food intake time distribution'
        }
      }
    });
  }

  createPieChart() {
    this.bars = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Carb', 'Protein', 'Sugar', 'Fat', 'Fiber'],
        datasets: [{
          label: 'Today intake composition',
          data: [100, 50, 20, 30, 15],
          backgroundColor: [
            'rgb(0,183,218)',
            'rgb(243,220,0)',
            'rgb(242,133,0)',
            'rgb(237,0,81)',
            'rgb(38, 194, 129)',
          ], // array should have same number of elements as number of dataset
          // borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          // borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Daily Nutrition Breakdown'
        }
      }
    });
  }

}
