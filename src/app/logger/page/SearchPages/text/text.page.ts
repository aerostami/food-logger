import { Component, OnInit } from '@angular/core';
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
  public mode;
  data;
  searchTerm: any;
  searching = false;
  searchFailed = false;
  searchResult = ['1', '2', '3'];
  isLoading = false;
  items = ["z", "zz", "zzz"];
  public selectedFood = [];
  public outdata = [];
  public inputVar = '';


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


  ngOnInit() {}

  ionViewWillEnter() {
    this.mode = localStorage.getItem('mode');
  }

  addItem(term: string) {
    this.rest.getRestNutritionix().all('/v2/natural/').one('nutrients')
                  .post('', {query: term}).subscribe(response => {

                    this.data = response.foods[0];
                    if (this.mode == 'food') {
                      this.outdata.push({...this.data});
                    } else if (this.mode == 'recipe') {
                      this.outdata.push({...this.data})
                    }
                    this.inputVar = '';
                });

  }
  public next() {
    if (this.mode == 'food') {
      localStorage.setItem('foods', JSON.stringify(this.outdata));
      this.router.navigate(["/","logger","logfood"]);
    } else if (this.mode == 'recipe') {
      localStorage.setItem('intergredient', JSON.stringify(this.outdata));
      this.router.navigate(["/","logrecipe"]);
    }
  }
  selectedItem(item){
      this.addItem(item.item.food_name);
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

}
