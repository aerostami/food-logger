import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpRestService } from "../../service/http-rest.service";
import { FsService } from '../../service/fs.service';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.page.html',
  styleUrls: ['./barcode.page.scss'],
})
export class BarcodePage implements OnInit {
  barcodeText: String;

  constructor(private barcodeScanner: BarcodeScanner) {
    this.barcodeScanner.scan().then(barcodeData => {
      this.barcodeText = barcodeData.text;
      // For debugging purposes
      alert(barcodeData);
      console.log(barcodeData);
     }).catch(err => {
         alert('Error: ' + err + '. Please try it again later.');
     });
  }

  ngOnInit() {
  }

}
