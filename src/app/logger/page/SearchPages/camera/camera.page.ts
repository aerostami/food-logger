import { Component, OnInit } from '@angular/core';
import { PassioCamera} from '../../../../../../../../passio-plugin-test';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { GoogleCloudVisionService} from './googleCloudVisionService';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage {

  public selectedfeature = 'LABEL_DETECTION';

  constructor(private camera: Camera,
              private route: Router,
              private vision: GoogleCloudVisionService,
              public loadingController: LoadingController,
              public alertController: AlertController) {
    console.log('Hello');
  }

  async selectPhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };
    this.camera.getPicture(options).then(async (imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      const loading = await this.loadingController.create({
        message: 'Getting Results...',
        translucent: true
      });
      await loading.present();
      this.vision.getLabels(imageData, this.selectedfeature).subscribe(async (result: any) => {
        console.log(result);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            special: JSON.stringify(imageData),
            result: JSON.stringify(result),
            feature: JSON.stringify(this.selectedfeature)
          }
        };

        await this.route.navigate(['showresult'], navigationExtras);
        await loading.dismiss();
      }, async (err) => {
        console.log(err);
        await loading.dismiss();
      });
    }, async (err) => {
      console.log(err);
    });
  }

  async takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // correctOrientation: true
    };
    this.camera.getPicture(options).then(async (imageData) => {
      const loading = await this.loadingController.create({
        message: 'Getting Results...',
        translucent: true
      });
      await loading.present();
      this.vision.getLabels(imageData, this.selectedfeature).subscribe(async (result: any) => {
        console.log(result);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            special: JSON.stringify(imageData),
            result: JSON.stringify(result),
            feature: JSON.stringify(this.selectedfeature)
          }
        };

        await this.route.navigate(['showresult'], navigationExtras);
        await loading.dismiss();
      }, async (err) => {
        await loading.dismiss();
      });
    }, err => {
      console.log(err);
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Select one option ',
      message: 'Take Photo or Select from Gallery!!!',
      buttons: [
        {
          text: 'Camera',
          role: 'camera',
          handler: () => {
            this.takePhoto();
          }
        }, {
          text: 'Gallery',
          role: 'gallery',
          handler: () => {
            this.selectPhoto();
          }
        }
      ]
    });

    await alert.present();
  }



}
