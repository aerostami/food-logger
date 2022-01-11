import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowresultPageRoutingModule } from './showresult-routing.module';

import { ShowresultPage } from './showresult.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowresultPageRoutingModule
  ],
  declarations: [ShowresultPage]
})
export class ShowresultPageModule {}
