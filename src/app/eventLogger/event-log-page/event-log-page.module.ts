import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventLogPagePageRoutingModule } from './event-log-page-routing.module';

import { EventLogPagePage } from './event-log-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventLogPagePageRoutingModule
  ],
  declarations: [EventLogPagePage]
})
export class EventLogPagePageModule {}
