import { Component, OnInit } from '@angular/core';
import { FsService } from '../../service/fs.service';
import { ModalController } from '@ionic/angular';
import { AddRecipeToFoodPage } from '../add-recipe-to-food/add-recipe-to-food.page';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
})
export class RecipePage implements OnInit {
  public recipes;
  public recipeNum = 0;
  public items=[];

  constructor(
    private fsService: FsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    localStorage.setItem('mode', 'recipe')
    var mode = localStorage.getItem('mode')

    this.recipes = this.fsService.getRecipes();
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
      const searchbar = document.getElementById('searchbar')

      searchbar.addEventListener('ionInput', this.handleInput);
      
    
      
    })
    
  }
  public handleInput(event) {
    const query = event.target.value.toLowerCase();

      requestAnimationFrame(() => {
        const items = Array.from(document.getElementById('list').children as HTMLCollectionOf<HTMLElement>)
        items.forEach((item) => {
          const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
          item.style.display = shouldShow ? 'block' : 'none';
        });
      });
  }
  public async openAddRecipeToFoodModal(recipe){
    const modal = await this.modalController.create({
      component: AddRecipeToFoodPage,
      componentProps: {
        "recipe": recipe
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // this.dataReturned = dataReturned.data;
        // console.log(this.dataReturned);
        // alert('Modal Sent Data :'+ dataReturned);
      }
    })
    return await modal.present();
    
  }
  public deleteRecipe(recipe_name){
    var recipe_list = JSON.parse(localStorage.getItem("recipes"));
    var i = 0;
    var remove_index = -1;
    recipe_list.forEach(element => {
      if (element.food_name ==recipe_name) {
        remove_index = i;
      }
      i++;
    });
    if (remove_index>-1){
      recipe_list.splice(remove_index, 1)
    }
    this.fsService.createNewRecipeList({'recipes':recipe_list})
  }

  public addRecipeToFood(recipe) {
    this.fsService.addRecipeToFood(recipe);
  }
  
  
}
