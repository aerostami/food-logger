import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';

import { IonicModule } from '@ionic/angular';

import { AddfoodPageRoutingModule } from './addfood-routing.module';

import { AddfoodPage } from './addfood.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddfoodPageRoutingModule,
    FlatpickrModule.forRoot(),
  ],
  declarations: [AddfoodPage]
})
export class AddfoodPageModule {}
