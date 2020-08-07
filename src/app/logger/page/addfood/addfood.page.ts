import { Component, OnInit } from '@angular/core';

import { FsService } from '../../service/fs.service';
import { Router } from '@angular/router';
import {
  ToastController,
} from '@ionic/angular';

import { PhotoService } from '../../../services/photo.service';

@Component({
  selector: 'app-addfood',
  templateUrl: './addfood.page.html',
  styleUrls: ['./addfood.page.scss'],
})
export class AddfoodPage implements OnInit {

  public amount: number = 2;
  public enjoyment: number = 3;
  ratingEmoji: string;
  ratingColor: string;
  myToastController: ToastController;
  public logTime = "";
  public logDate = "";



  public currentDate = new Date();
  public hour = this.currentDate.getHours();
  public minute = this.currentDate.getMinutes();

  public foods = [];
  public time = {hour: this.hour, minute: this.minute};
  private timeDate;
  private dateDate;
  photos = this.photoService.photos;
  constructor(
    private fsService: FsService,
    private router: Router,
    private toastController: ToastController,
    public photoService: PhotoService
    ) {
    this.foods = JSON.parse(localStorage.getItem("foods"));
    this.myToastController = toastController;

  }



  ngOnInit() {
    this.photoService.loadSaved().then( _ => {
      this.photos = this.photoService.photos;
    });
    this.ratingEmoji = "happy";
    this.ratingColor ="#b7dd29";
    this.logDate = this.currentDate.toISOString();
    this.logTime = this.currentDate.toISOString();
    for(let i=0; i<this.foods.length; i++){
      console.log(this.foods[i]);
      this.foods[i].logDate = this.currentDate.toISOString();
      this.foods[i].logTime = this.currentDate.toISOString();
      this.foods[i].amount = 1;
      this.foods[i].rating = 3;
      this.foods[i].ratingColor = "#b7dd29";
      this.foods[i].ratingEmoji = "happy";

    }
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

  public logFood(food: any, serving: Number, rating: Number) {
    this.timeDate = new Date(food.logTime);
    this.dateDate = new Date(food.logDate);
    this.hour = this.timeDate.getHours();
    this.minute = this.timeDate.getMinutes();
    this.dateDate.hours = this.hour;
    this.dateDate.setMinutes(this.minute);
    this.dateDate.setHours(this.hour);
    this.time = {hour: this.hour, minute: this.minute};
    var data = {'food':{...food}, 'amount': serving, 'rating': rating, 'date': this.dateDate, 'time': this.time};
    const index = this.foods.indexOf(food);
    console.log(data);
    this.fsService.logfood(data, this.currentDate);
    this.foods.splice(index, 1);
    localStorage.setItem("foods",JSON.stringify(this.foods));
    if (this.foods.length == 0) {
      this.router.navigate(['/logger/home']);
    }

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
      message: 'Log successful',
    });

    await toast.present();
  }

  async  closeModalSuccess(){
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('add-btn');
    for(let i=0; i< elements.length; i++){
      (elements[i] as HTMLElement).click();
    }

    this.startToast();
  }

}
