import { Component, OnInit } from '@angular/core';
import { HttpRestService } from "../../service/http-rest.service";
import { FsService } from '../../service/fs.service';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.page.html',
  styleUrls: ['./voice.page.scss'],
})
export class VoicePage implements OnInit {

  text: string;
  foods: any;
  constructor(
    private rest: HttpRestService,
    private fsService: FsService,
    ) { }

  ngOnInit() {
  }

  searchForText() {
    this.rest.getRestNutritionix().all('/v2/natural/').one('nutrients').post('', {
      query: this.text
    }).subscribe(response => {
      this.foods = response.foods;

      this.foods.forEach (food => {
        this.fsService.addItem(food);
      });
      localStorage.setItem('foods', JSON.stringify(this.foods));
    });
  }

}
