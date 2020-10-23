import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewRecipePage } from './new-recipe.page';

const routes: Routes = [
  {
    path: '',
    component: NewRecipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewRecipePageRoutingModule {}
