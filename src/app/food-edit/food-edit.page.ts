import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  NavParams
} from '@ionic/angular';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.page.html',
  styleUrls: ['./food-edit.page.scss'],
})
export class FoodEditPage implements OnInit {
  public amount: number = 2;
  public enjoyment: number = 3;
  ratingEmoji: string;
  ratingColor: string;
  myToastController: ToastController;
  public logTime = "";
  public logDate = "";
  date: Date;
  food: any;
  constructor(private modalController: ModalController, private toastController: ToastController,
              private navParams: NavParams, public photoService: PhotoService) {
    this.myToastController = toastController;
  }

  ngOnInit() {
    this.food = this.navParams.data.food;
    console.table(this.food);
    console.log(this.food.date);
    this.photoService.loadSaved().then( _ => {
      // this.photos = this.photoService.photos;
    });
    this.ratingEmoji = this.food.ratingEmoji;
    this.ratingChange(this.food);
    this.date = this.food.date;
    // this.date = new Date();
    this.logDate = this.date.toISOString();
    this.logTime = this.date.toISOString();
  }
  async closeModal() {
    // const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss();
  }

  ratingChange(f){
    if(f.rating==1){
      f.ratingEmoji="thumbs-down";
      f.ratingColor="#ff4545";
    } else if(f.rating==2){
      f.ratingEmoji="sad";
      f.ratingColor="#ffa534";
    }else if(f.rating==3){
      f.ratingEmoji="happy";
      f.ratingColor="#b7dd29";
    } else if(f.rating==4){
      f.ratingEmoji="thumbs-up";
      f.ratingColor="#57e32c";
    } else if(f.rating==5){
      f.ratingEmoji="heart";
      f.ratingColor="#00bd09";
    }

  }
  async startToast(){
    const toast = await this.myToastController.create({
      color: 'dark',
      duration: 2000,
      message: 'Edit successful',
    });

    await toast.present();
  }

  public removePhoto(food){
    this.photoService.deletePhoto(food.localPhoto);
    food.localPhoto = "";
  }

  public takePicture(food: any){
    if(food.localPhoto){
      this.photoService.deletePhoto(food.localPhoto);
    }
    let photoname = this.photoService.addNewToGallery(food.tag_id);
    photoname.then( res => { food.localPhoto = res; console.log(food); } );
  }


  async  save(food, amount, rating){
    // const onClosedData: string = "success";
    await this.modalController.dismiss();
    this.startToast();
  }

}
