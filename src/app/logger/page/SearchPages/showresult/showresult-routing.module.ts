import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowresultPage } from './showresult.page';

const routes: Routes = [
  {
    path: '',
    component: ShowresultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowresultPageRoutingModule {}
