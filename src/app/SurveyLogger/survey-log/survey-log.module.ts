import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyLogPageRoutingModule } from './survey-log-routing.module';

import { SurveyLogPage } from './survey-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveyLogPageRoutingModule
  ],
  declarations: [SurveyLogPage]
})
export class SurveyLogPageModule {}
