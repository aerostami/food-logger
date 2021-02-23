import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogfoodPage } from './logfood.page';

const routes: Routes = [
  {
    path: '',
    component: LogfoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogfoodPageRoutingModule {}
