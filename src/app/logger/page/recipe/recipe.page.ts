import { Component, OnInit } from '@angular/core';
import { FsService } from '../../service/fs.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
})
export class RecipePage implements OnInit {
  public recipes;
  public recipeNum = 0;

  constructor(
    private fsService: FsService,
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    localStorage.setItem('mode', 'recipe')
    var mode = localStorage.getItem('mode')

    this.recipes = this.fsService.getRecipets();
    this.recipes.subscribe((result) => {
      var recipes_list =result.recipes
      if (result.recipes) {
        localStorage.setItem('recipes', JSON.stringify(recipes_list));
      } else {
        localStorage.setItem('recipes', JSON.stringify([]));
      }
      if (result.recipes){

        this.recipeNum = result.recipes.length;
      }
    })
    
  }

}