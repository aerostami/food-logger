import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FsService } from '../../../service/fs.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-recipe-to-food',
  templateUrl: './add-recipe-to-food.page.html',
  styleUrls: ['./add-recipe-to-food.page.scss'],
})
export class AddRecipeToFoodPage implements OnInit {
  public recipe;
  public intergredients;
  public currentDate = new Date();
  public amount;
  constructor(
    private modalController: ModalController, 
    private navParams: NavParams,
    private fsService: FsService, 

  ) { }

  ngOnInit() {
    this.recipe = this.navParams.data.recipe;
    this.intergredients = this.recipe.intergredients;
    
  }
  async closeModal() {
    await this.modalController.dismiss();
  }

  public addRecipeToFood(recipe) {
    this.fsService.addRecipeToFood(recipe);
    this.closeModal();
  }
  

}
