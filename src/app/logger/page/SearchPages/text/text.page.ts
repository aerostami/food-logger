import {Component, OnInit, ViewChild} from '@angular/core';
import { FsService } from '../../../service/fs.service';
import {Observable, of} from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import { HttpRestService } from '../../../service/http-rest.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
})
export class TextPage implements OnInit {
    @ViewChild('searchInput') sInput;
  public mode;
  data;
  searchTerm: any;
  searching = false;
  searchFailed = false;
  searchResult = ['1', '2', '3'];
  isLoading = false;
  items = ['z', 'zz', 'zzz'];
  public selectedFood = [];
  public outdata = [];
  public inputVar = '';
  public ADIIScore = 0;

  constructor(
    private fsService: FsService,
    private rest: HttpRestService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.route.queryParams.subscribe(params => {
          if (params && params.image) {
              this.inputVar = JSON.parse(params.image);
              console.log(this.inputVar);
          }});

  }


  ngOnInit() {
    // this.ADIIScore = this.calcADII();
  }

  ionViewWillEnter() {
    this.mode = localStorage.getItem('mode');
    this.sInput.nativeElement.focus();
  }

  addItem(term: string) {
    this.rest.getRestNutritionix().all('/v2/natural/').one('nutrients')
                  .post('', {query: term}).subscribe(response => {

                    this.data = response.foods[0];
                    if (this.mode === 'food') {
                        this.data.ADIIScore = this.calcADII(this.data);
                        this.data.ADIIScore5 = Math.floor( 5 - ((this.data.ADIIScore + 2) / 12 * 5));
                        console.log(this.data.ADIIScore);
                        this.ratingChange(this.data);
                        this.outdata.push({...this.data});
                    } else if (this.mode === 'recipe') {
                      this.outdata.push({...this.data});
                    }
                    this.inputVar = '';
                });

  }

    ratingChange(f){
        if(f.ADIIScore5 === 0){
            f.ratingEmoji="thumbs-down";
            f.ratingColor="#ff4545";
        } else if(f.ADIIScore5 === 1){
            f.ratingEmoji="sad";
            f.ratingColor="#ffa534";
        }else if(f.ADIIScore5===2){
            f.ratingEmoji="happy";
            f.ratingColor="#b7dd29";
        } else if(f.ADIIScore5 === 3){
            f.ratingEmoji="thumbs-up";
            f.ratingColor="#57e32c";
        } else{
            f.ratingEmoji="heart";
            f.ratingColor="#00bd09";
        }
    }


  public next() {
    if (this.mode == 'food') {
      localStorage.setItem('foods', JSON.stringify(this.outdata));
      this.router.navigate(['/', 'logger', 'logfood']);
    } else if (this.mode == 'recipe') {
      localStorage.setItem('intergredient', JSON.stringify(this.outdata));
      this.router.navigate(['/', 'logrecipe']);
    }
  }
  selectedItem(item){
      this.addItem(item.item.food_name);
      // console.log('added item:', item.item);
  }
    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>
                this.rest.getRestNutritionix().all('/v2/search/')
                    .get('instant', {query: term}).pipe(
                    map(response => response['common']),
                    tap(() => this.searchFailed = false),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        );
  formatter(x: {food_name: string}){
    // this.selectedFood.push(x);
    return x.food_name;
  }

  calcADII(food){
      const avgCalorie = 407.60033930254474;
      const stdList = [
          33.00578904995775,
          47.99784203971786,
          0.0,
          0.0,
          4.922349614322802,
          8.95696211077993,
          0.0,
          0.0,
          0.0,
          3061.3486053098186,
          0.0,
          0.0,
          17.372579071465424,
          119.159543469192,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          134.957787688347,
          1.1100282601670346,
          12.07603221052699,
          0.0,
          0.4740187231944831
      ];
      const indexes = {
              protein: {inflammatory_weight: 0.021, w: 0.04872704733154099, b: -4.317237839873371},
              carbohydrate: {inflammatory_weight: 0.097, w: 0.06588104068633376, b: 15.338377008357206},
              alcohol: {inflammatory_weight: -0.278, w: 0.0, b: 0.0},
              caffeine: {inflammatory_weight: -0.11, w: 0.0, b: 0.0},
              dietary_fiber: {inflammatory_weight: -0.663, w: 0.0037658255284080885, b: 0.9812782085914664},
              iron: {inflammatory_weight: 0.032, w: 0.00040313377216521064, b: 0.4260053463522104},
              magnesium: {inflammatory_weight: -0.484, w: 0.0, b: 0.0},
              zinc: {inflammatory_weight: -0.313, w: 0.0, b: 0.0},
              selenium: {inflammatory_weight: -0.191, w: 0.0, b: 0.0},
              vit_a: {inflammatory_weight: -0.401, w: 0.40671333127594705, b: 90.42367315891815},
              beta_carotene: {inflammatory_weight: -0.584, w: 0.0, b: 0.0},
              vit_e: {inflammatory_weight: -0.419, w: 0.0, b: 0.0},
              vit_d: {inflammatory_weight: -0.446, w: -0.000958816510837688, b: 1.3291645477759184},
              vit_c: {inflammatory_weight: -0.424, w: 0.007126192395609035, b: 1.8872607133581805},
              thiamin: {inflammatory_weight: -0.098, w: 0.0, b: 0.0},
              riboflavin: {inflammatory_weight: -0.068, w: 0.0, b: 0.0},
              niacin: {inflammatory_weight: -0.246, w: 0.0, b: 0.0},
              vit_b6: {inflammatory_weight: -0.365, w: 0.0, b: 0.0},
              total_folate: {inflammatory_weight: -0.19, w: 0.0, b: 0.0},
              vit_b12: {inflammatory_weight: 0.106, w: 0.0, b: 0.0},
              cholesterol: {inflammatory_weight: 0.11, w: 0.1785885574182024, b: -20.141118993179248},
              total_fat: {inflammatory_weight: 0.229, w: 0.0008811476090316515, b: -0.15505615866763403},
              total_saturated_fatty_acids: {inflammatory_weight: 0.373, w: 0.017422291377789972, b: -0.790749878900006},
              total_polyunsaturated_fatty_acids: {inflammatory_weight: -0.436, w: 0.0, b: 0.0},
              total_monounsaturated_fatty_acids: {inflammatory_weight: -0.009, w: -3.6360754152347224e-05, b: 0.061262691545061754}
          };
      /*
      const params = {
          protein: 0.0,
          carbohydrate: 0.0,
          alcohol: 0.0,
          caffeine: 0.0,
          dietary_fiber: 0.0,
          iron: 0.0,
          magnesium: 0.0,
          zinc: 0.0,
          selenium: 0.0,
          vit_a: 0.0,
          beta_carotene: 0.0,
          vit_e: 0.0,
          vit_d: 0.0,
          vit_c: 0.0,
          thiamin: 0.0,
          riboflavin: 0.0,
          niacin: 0.0,
          vit_b6: 0.0,
          total_folate: 0.0,
          vit_b12: 0.0,
          cholesterol: 0.0,
          total_fat: 0.0,
          total_saturated_fatty_acids: 0.0,
          total_polyunsaturated_fatty_acids: 0.0,
          total_monounsaturated_fatty_acids: 0.0
      };*/
      let full_nuts = {};
      for (let i = 0; i < food.full_nutrients.length; i++){
            if (food.full_nutrients[i].value === undefined){
                full_nuts[food.full_nutrients[i].attr_id] = 0;
            }else{
              full_nuts[food.full_nutrients[i].attr_id] = food.full_nutrients[i].value;
            }
      }
      //console.log(full_nuts);
      const params = {
          // tslint:disable-next-line:only-arrow-functions
          protein: Math.max((full_nuts['203'] === undefined) ? 0 : full_nuts['203'], food.nf_protein),
          carbohydrate: Math.max((full_nuts['205'] === undefined) ? 0 : full_nuts['205'], food.nf_total_carbohydrate),
          alcohol: full_nuts['221'],
          caffeine: full_nuts['262'],
          dietary_fiber: Math.max((full_nuts['291'] === undefined) ? 0 : full_nuts['291'], food.nf_dietary_fiber),
          iron: full_nuts['303'],
          magnesium: full_nuts['304'],
          zinc: full_nuts['309'],
          selenium: full_nuts['317'],
          vit_a: full_nuts['318'],
          beta_carotene: full_nuts['321'],
          vit_e: full_nuts['323'],
          vit_d: full_nuts['324'],
          vit_c: full_nuts['401'],
          thiamin: full_nuts['404'],
          riboflavin: full_nuts['405'],
          niacin: full_nuts['406'],
          vit_b6: full_nuts['415'],
          total_folate: full_nuts['417'],
          vit_b12: full_nuts['418'],
          cholesterol: full_nuts['601'],
          total_fat: Math.max((full_nuts['605'] === undefined) ? 0 : full_nuts['605'] , food.nf_total_fat),
          total_saturated_fatty_acids: Math.max((full_nuts['606'] === undefined) ? 0 : full_nuts['606'], food.nf_saturated_fat),
          total_polyunsaturated_fatty_acids: full_nuts['621'],
          total_monounsaturated_fatty_acids: full_nuts['645']
      };
      console.log(params);
      const zScores = new Array();

      const keys = Object.keys(params);
      for (let i = 0; i < keys.length; i++) {
          const k1 = keys[i];
          let v1 = params[k1];
          if (v1 === undefined){
              params[k1] = 0;
              v1 = 0;
          }
          for (let j = 0; j < keys.length; j++) {
              const k2 = keys[j];
              const v2 = indexes[k2];
              if (k1 === k2 && stdList[j] !== 0){
                  zScores.push((v1 - (v2.w + v2.b)) / stdList[i]);
              }else if (k1 === k2 && stdList[i] === 0){
                  zScores.push(0.0);
              }
          }
      }
      let ADIIScore = 0.0;
      for (let j = 0; j < keys.length; j++) {
          const k3 = keys[j];
          const v3 = indexes[k3];
          ADIIScore += zScores[j] * v3.inflammatory_weight;
      }
      if (ADIIScore > 10){
          ADIIScore = 10;
      }
      if (ADIIScore < -2){
          ADIIScore = -2;
      }
      // ADIIScore = ((ADIIScore + 2) / 12) * 5;
      // ADIIScore = -1 * ADIIScore;
      ADIIScore = Math.floor(ADIIScore * 10) / 10;
      // ADIIScore = 5 - ADIIScore;

      return ADIIScore;
  }

}
