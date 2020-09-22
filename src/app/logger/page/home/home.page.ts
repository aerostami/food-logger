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
  @ViewChild('barChart') barChart;

  bars: any;
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
    this.createBarChart();
    
  }
  
  logout() {
    this.as.logout();
    
  }
  
  deletefood(id: any, date: any) {
    var formatted_date = date.toDate();
    this.fsService.deleteItem(id, formatted_date);
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['calories', 'salt', 'suger'],
        datasets: [{
          label: 'g',
          data: [100, 50, 30],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}
