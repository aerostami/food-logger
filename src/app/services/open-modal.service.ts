import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FoodEditPage } from '../logger/page/food-edit/food-edit.page';

@Injectable({
  providedIn: 'root'
})
export class OpenModalService {

  constructor(
    private modalController:ModalController,
  ) { }

  public async openFoodEditModal(food){
    const modal = await this.modalController.create({
      component: FoodEditPage,
      componentProps: {
        "food": food,
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
}
