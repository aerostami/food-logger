import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodEditPageRoutingModule } from './food-edit-routing.module';

import { FoodEditPage } from './food-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodEditPageRoutingModule
  ],
  declarations: [FoodEditPage]
})
export class FoodEditPageModule {
}
