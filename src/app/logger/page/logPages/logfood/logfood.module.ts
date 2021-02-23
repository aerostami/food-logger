import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';

import { IonicModule } from '@ionic/angular';

import { LogfoodPageRoutingModule } from './logfood-routing.module';

import { LogfoodPage } from './logfood.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogfoodPageRoutingModule,
    FlatpickrModule.forRoot(),
  ],
  declarations: [LogfoodPage]
})
export class LogfoodPageModule {}
