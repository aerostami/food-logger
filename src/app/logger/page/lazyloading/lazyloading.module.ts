import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LazyloadingPageRoutingModule } from './lazyloading-routing.module';

import { LazyloadingPage } from './lazyloading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyloadingPageRoutingModule
  ],
  declarations: [LazyloadingPage]
})
export class LazyloadingPageModule {}
