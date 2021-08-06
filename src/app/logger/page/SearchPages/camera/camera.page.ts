import { Component, OnInit } from '@angular/core';
import { PassioCamera} from '../../../../../../../../passio-plugin-test';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  printInfo = '';

  async webPrintInfo() {
    this.printInfo = (await PassioCamera.pageInfoPrint()).infoP;
    console.log('plugin info: ', this.printInfo);
    // return this.printInfo;
  }

  constructor() {
    this.webPrintInfo();
  }

  ngOnInit() {
  }

}
