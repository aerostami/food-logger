import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogRecipePageRoutingModule } from './logrecipe-routing.module';

import { LogRecipePage } from './logrecipe.page';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogRecipePageRoutingModule,
    NgbModule,
  ],
  declarations: [LogRecipePage]
})
export class LogRecipePageModule {}
