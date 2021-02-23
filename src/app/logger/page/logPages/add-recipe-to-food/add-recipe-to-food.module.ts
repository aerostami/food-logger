import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecipeToFoodPageRoutingModule } from './add-recipe-to-food-routing.module';

import { AddRecipeToFoodPage } from './add-recipe-to-food.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRecipeToFoodPageRoutingModule
  ],
  declarations: [AddRecipeToFoodPage]
})
export class AddRecipeToFoodPageModule {}
