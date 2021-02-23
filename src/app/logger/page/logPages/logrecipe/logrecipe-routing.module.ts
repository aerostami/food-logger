import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogRecipePage } from './logrecipe.page';

const routes: Routes = [
  {
    path: '',
    component: LogRecipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogRecipePageRoutingModule {}
