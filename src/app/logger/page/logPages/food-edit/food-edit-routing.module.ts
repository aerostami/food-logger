import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodEditPage } from './food-edit.page';

const routes: Routes = [
  {
    path: '',
    component: FoodEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodEditPageRoutingModule {}
