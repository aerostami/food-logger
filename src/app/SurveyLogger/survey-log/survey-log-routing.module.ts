import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyLogPage } from './survey-log.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyLogPageRoutingModule {}
