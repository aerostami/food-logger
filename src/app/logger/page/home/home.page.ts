import { Component, OnInit } from '@angular/core';
import { FsService } from '../../service/fs.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {FoodEditPage} from '../food-edit/food-edit.page';

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
      public modalController: ModalController
  ) {
    this.foods = this.fsService.getTodayFood();

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
    
    this.foods.subscribe(event => this.foodNum = event.length);

  }
  logout() {
    localStorage.setItem('username', null);
    const username = localStorage.getItem('username');
    console.log(username)
    this.router.navigate(['/','auth','login'])
  }
  deletefood(id: any, date: any) {
    var formatted_date = date.toDate();
    this.fsService.deleteItem(id, formatted_date);
  }

}
