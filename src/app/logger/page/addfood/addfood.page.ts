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

  public logfoods = [];



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
      this.logfoods.push({'food': this.foods[i]});
      
      this.logfoods[i].logDate = this.currentDate.toISOString();
      this.logfoods[i].logTime = this.currentDate.toISOString();
      this.logfoods[i].amount = 5;
      this.logfoods[i].rating = 3;
      this.logfoods[i].ratingEmoji = this.ratingEmoji;
      this.logfoods[i].ratingColor = this.ratingColor;
      

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
    var hour = this.timeDate.getHours();
    var minute = this.timeDate.getMinutes();

    this.time = {hour: hour, minute: minute};
    var data = {...food,  'date': this.timeDate, 'time': this.time };
    const index = this.logfoods.indexOf(food);
    this.fsService.logfood(data, this.currentDate);
    this.logfoods.splice(index, 1);
    localStorage.setItem("foods",JSON.stringify(this.logfoods));
    if (this.logfoods.length == 0) {
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
