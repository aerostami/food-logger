import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddfoodPage } from './addfood.page';

const routes: Routes = [
  {
    path: '',
    component: AddfoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddfoodPageRoutingModule {}
