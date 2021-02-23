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
    loadChildren: () => import('./logger/page/tabPages/tabs/tabs.module').then( m => m.TabsPageModule)
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
    loadChildren: () => import('./logger/page/SearchPages/text/text.module').then( m => m.TextPageModule)
  },
  {
    path: 'logger/addfood',
    loadChildren: () => import('./logger/page/logPages/addfood/addfood.module').then( m => m.AddfoodPageModule)
  },
  {
    path: 'logger/voice',
    loadChildren: () => import('./logger/page/SearchPages/voice/voice.module').then( m => m.VoicePageModule)
  },
  {
    path: 'logger/barcode',
    loadChildren: () => import('./logger/page/SearchPages/barcode/barcode.module').then( m => m.BarcodePageModule)
  },
  {
    path: 'food-edit',
    loadChildren: () => import('./logger/page/logPages/food-edit/food-edit.module').then( m => m.FoodEditPageModule)
  },
  {
    path: 'user-info',
    loadChildren: () => import('./logger/page/logPages/user-info/user-info.module').then( m => m.UserInfoPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./logger/page/tabPages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./logger/page/tabPages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'adminpanel',
    loadChildren: () => import('./logger/page/tabPages/admin-panel/admin-panel.module').then( m => m.AdminPanelPageModule)
  },
  {
    path: 'new-recipe',
    loadChildren: () => import('./logger/page/logPages/new-recipe/new-recipe.module').then( m => m.NewRecipePageModule)
  },
  {
    path: 'recipe',
    loadChildren: () => import('./logger/page/tabPages/recipe/recipe.module').then( m => m.RecipePageModule)
  },
  {
    path: 'add-recipe-to-food',
    loadChildren: () => import('./logger/page/logPages/add-recipe-to-food/add-recipe-to-food.module').then( m => m.AddRecipeToFoodPageModule)
  },
  {
    path: 'auth/reset-password',
    loadChildren: () => import('./auth/page/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'eventLogger/event-log-page',
    loadChildren: () => import('./eventLogger/event-log-page/event-log-page.module').then( m => m.EventLogPagePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
