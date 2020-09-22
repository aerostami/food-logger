import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  NavParams
} from '@ionic/angular';


import { PhotoService } from '../../../services/photo.service';
import { FsService } from '../../service/fs.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { MapboxServiceService, Feature } from '../../../services/mapbox-service.service';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.page.html',
  styleUrls: ['./food-edit.page.scss'],
})
export class FoodEditPage implements OnInit {


  public amount: number;
  public enjoyment: number;
  ratingEmoji: string;
  ratingColor: string;
  myToastController: ToastController;

  public oldDate: Date;
  public logTime = "";
  public logDate = "";
  public date: Date;
  public food: any;
  addresses: string[] = [];
  selectedAddress = null;
  private justSelectedAddress = false;

  constructor(
    private modalController: ModalController, 
    private toastController: ToastController,
    private navParams: NavParams,
    private fsService: FsService, 
    public photoService: PhotoService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private mapboxService: MapboxServiceService
    ) {
    this.myToastController = toastController;
  }

  ngOnInit() {
    this.food = this.navParams.data.food;
    this.selectedAddress = this.food.address;
    this.photoService.loadSaved().then( _ => {
      // this.photos = this.photoService.photos;
    });
    this.ratingEmoji = this.food.ratingEmoji;
    this.ratingChange(this.food);
    this.date = this.food.date.toDate();
    this.oldDate = this.food.date.toDate();

    this.logDate = this.date.toISOString();
    this.logTime = this.date.toISOString();
  }
  async closeModal() {
    // const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss();
  }
  search(event: any) {
    if (this.justSelectedAddress){
      this.justSelectedAddress = false;
      return;
    }
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
          .search_word(searchTerm)
          .subscribe((features: Feature[]) => {
            this.addresses = features.map(feat => feat.place_name);
          });
    } else {
      this.addresses = [];
    }
  }
  onSelect(address: string, food) {
    this.selectedAddress = address;
    food.address = address;
    this.justSelectedAddress=true;
    this.addresses = [];
  }


  amountChanged(f){
    if(f.amount===0.5){
      f.badgeColor="Warning-tint";
    }else if(f.amount===1.0){
      f.badgeColor="Secondary-tint";
    }else if(f.amount===1.5){
      f.badgeColor="Secondary";
    }else if(f.amount===2.0){
      f.badgeColor="Secondary-shade";
    }else if(f.amount===2.5){
      f.badgeColor="Primary";
    }else if(f.amount===3.0){
      f.badgeColor="Primary-tint";
    }else if(f.amount===3.5){
      f.badgeColor="Primary-shade";
    }else if(f.amount===4.0){
      f.badgeColor="Tertiary-tint";
    }else if(f.amount===4.5){
      f.badgeColor="Tertiary";
    }else if(f.amount===5.0){
      f.badgeColor="Tertiary-shade";
    }
    if (f.amount === Math.floor(f.amount)){
      f.amount = f.amount + '.0';
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


  async  save(){
    const id = this.food.id;

    var timeDate = new Date(this.logTime);
    var dateDate = new Date(this.logDate);
    var hour = timeDate.getHours();
    var minute = timeDate.getMinutes();
    dateDate.setMinutes(minute);
    dateDate.setHours(hour);
    var time = {'hour': hour, 'minute': minute};

    var data = {...this.food,'date': dateDate, 'time': time};
    this.fsService.updateItem(id, data, this.oldDate, dateDate);
    // const onClosedData: string = "success";
    await this.modalController.dismiss();
    this.startToast();
  }

}
