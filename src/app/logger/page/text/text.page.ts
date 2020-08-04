import { Component, OnInit } from '@angular/core';
import { FsService } from '../../service/fs.service';
import {Observable, of} from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import { HttpRestService } from "../../service/http-rest.service";
@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
})
export class TextPage implements OnInit {
  data;
  searchTerm: any;
  searching =false;
  searchFailed = false;
  searchResult = ['1', '2', '3'];
  isLoading = false;
  items = ["z", "zz", "zzz"];
  public selectedFood = [];

  constructor(
    private fsService: FsService,
    private rest: HttpRestService
    ) {

  }


  ngOnInit(): void {
  }

  addItem(term: string) {
    this.rest.getRestNutritionix().all('/v2/search/')
                  .get('instant', {query: term}).subscribe(response => {

                    this.data = response['common'][0];
                    this.fsService.addItem(this.data);
                    var foodArray = [];
                    foodArray.push({...this.data});
                    localStorage.setItem('foods', JSON.stringify(foodArray));
                });

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
