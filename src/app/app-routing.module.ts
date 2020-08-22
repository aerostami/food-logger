import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'logger',
    loadChildren: () => import('./logger/page/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'auth/login',
    loadChildren: () => import('./auth/page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'auth/register',
    loadChildren: () => import('./auth/page/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'logger/text',
    loadChildren: () => import('./logger/page/text/text.module').then( m => m.TextPageModule)
  },
  {
    path: 'logger/addfood',
    loadChildren: () => import('./logger/page/addfood/addfood.module').then( m => m.AddfoodPageModule)
  },
  {
    path: 'logger/voice',
    loadChildren: () => import('./logger/page/voice/voice.module').then( m => m.VoicePageModule)
  },
  {
    path: 'logger/barcode',
    loadChildren: () => import('./logger/page/barcode/barcode.module').then( m => m.BarcodePageModule)
  },
  {
    path: 'food-edit',
    loadChildren: () => import('./logger/page/food-edit/food-edit.module').then( m => m.FoodEditPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
