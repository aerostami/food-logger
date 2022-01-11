import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {HttpRestService} from '../../../service/http-rest.service';


@Component({
  selector: 'app-showresult',
  templateUrl: './showresult.page.html',
  styleUrls: ['./showresult.page.scss'],
})
export class ShowresultPage implements OnInit {

  public selectIndex = 0;
  public selected = 'Hello';

  foods: any;

  image: any;
  result: any;
  feature: any;
  constructor(private route: ActivatedRoute, private router: Router, private rest: HttpRestService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.special && params.result && params.feature) {
        this.image = JSON.parse(params.special);
        this.result = JSON.parse(params.result);
        this.feature = JSON.parse(params.feature);
      }
      switch (this.feature) {
        default: {
          this.result = this.result.responses[0].labelAnnotations;
        }
      }
      console.log(this.result);
    });
  }

  radioGroupChange(event) {
    this.selectIndex = parseInt(event.detail.value, 10);
    this.selected = this.result[this.selectIndex].description;
  }

  next() {
    this.rest.getRestNutritionix().all('/v2/natural/').one('nutrients').post('', {
      query: this.selected
    }).subscribe(response => {
      this.foods = response.foods;
        this.foods.forEach(food => {
          this.router.navigate(["/","logger","logfood"]);
        });
        localStorage.setItem('foods', JSON.stringify(this.foods));
      }
    );

  }



}
