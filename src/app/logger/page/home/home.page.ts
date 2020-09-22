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

  pie: any;
  colorArray: any;

  calories = 0;
  suger = 0;
  protein = 0;
  sodium = 0;
  fat = 0;
  carbohydrate = 0;

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
    
    this.foods.subscribe(event => {
      this.foodNum = event.length;
      event.forEach(element => {
        this.calories = this.calories + element.food.nf_calories * parseInt(element.amount);
        this.sodium = this.sodium + element.food.nf_sodium * parseInt(element.amount);
        this.protein = this.protein + element.food.nf_protein * parseInt(element.amount)
        this.fat = this.fat + element.food.nf_total_fat
        this.carbohydrate = this.carbohydrate + element.food.nf_total_carbohydrate

      });
      this.createBarChart();
    });
    
    
    
  }
  
  logout() {
    this.as.logout();
    
  }
  
  deletefood(id: any, date: any) {
    var formatted_date = date.toDate();
    this.fsService.deleteItem(id, formatted_date);
  }

  createBarChart() {
    this.pie = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['protein', 'fat', 'carbohydrates'],
        datasets: [{
          label: 'g',
          data: [this.protein, this.fat, this.carbohydrate],
          backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ]
        }]
      },
      options: {
        
      }
    });
  }

  calculateCalories(food:any) {
    this.calories =  food.food.nf_calories * parseInt(food.amount)
    return this.calories 
  }

}
