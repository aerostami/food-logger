import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventLogPagePage } from './event-log-page.page';

const routes: Routes = [
  {
    path: '',
    component: EventLogPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventLogPagePageRoutingModule {}
