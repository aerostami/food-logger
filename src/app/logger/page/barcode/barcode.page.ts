import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { HttpRestService } from "../../service/http-rest.service";
import { FsService } from "../../service/fs.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-barcode",
  templateUrl: "./barcode.page.html",
  styleUrls: ["./barcode.page.scss"],
})
export class BarcodePage implements OnInit {
  barcodeText: String;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private rest: HttpRestService,
    private fsService: FsService,
    private router: Router
  ) {
    this.startScanner();
  }

  startScanner() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        this.barcodeText = barcodeData.text;
        this.searchForText(this.barcodeText);
        // For debugging purposes
        console.log(barcodeData);
      })
      .catch((err) => {
        alert("Error: " + err + ". Please try it again later.");
      });
  }

  searchForText(barcodeText: String) {
    console.log(this.rest.getRestNutritionix());
    this.rest.getRestNutritionix().one('/v2/search/item?upc=' + barcodeText).get('', {
    }).subscribe(response => {
      let foods = response.foods;

      foods.forEach(food => {
        this.router.navigate(["/","logger","addfood"]);
      });
      localStorage.setItem('foods', JSON.stringify(foods));
    });
  }

  ngOnInit() {}
}
