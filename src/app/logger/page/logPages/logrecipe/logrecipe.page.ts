import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import { HttpRestService } from "../../../service/http-rest.service";
import { FsService } from '../../../service/fs.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-logrecipe',
  templateUrl: './logrecipe.page.html',
  styleUrls: ['./logrecipe.page.scss'],
})
export class LogRecipePage implements OnInit {
  public name = ""
  public intergredients;
  public aintergredients = [];
  public data;
  
  

  constructor(
    private fsService: FsService,
    private rest: HttpRestService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.intergredients = JSON.parse(localStorage.getItem("intergredient"))

    for(let i=0; i<this.intergredients.length;i++) {
      this.aintergredients.push({'intergredient':this.intergredients[i]})
      this.aintergredients[i].amount = 2;
      this.aintergredients[i].badgeColor = 'Secondary';
    }
  

  }
  public createNewRecipe() {
    if (this.name.trim() == "")  {
      this.startToast()
    } else {
      var recipes = JSON.parse(localStorage.getItem('recipes'))
      recipes.push({'food_name':this.name, 'intergredients': this.aintergredients, 'photo': this.aintergredients[0].intergredient.photo})
      this.fsService.createNewRecipeList({'recipes':recipes})
    }
  }

  

  

  
  
  public amountChanged(f){
    if(f.amount===0.5){
      f.badgeColor="Warning-tint";
    }else if(f.amount===1.0){
      f.badgeColor="Secondary-tint";
    }else if(f.amount===1.5){
      f.badgeColor="Secondary";
    }else if(f.amount===2.0){
      f.badgeColor="Secondary-shade";
    }else if(f.amount===2.5){
      f.badgeColor="Primary";
    }else if(f.amount===3.0){
      f.badgeColor="Primary-tint";
    }else if(f.amount===3.5){
      f.badgeColor="Primary-shade";
    }else if(f.amount===4.0){
      f.badgeColor="Tertiary-tint";
    }else if(f.amount===4.5){
      f.badgeColor="Tertiary";
    }else if(f.amount===5.0){
      f.badgeColor="Tertiary-shade";
    }
    if (f.amount === Math.floor(f.amount)){
      f.amount = f.amount + '.0';
    }
  }

  async startToast(){
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      message: 'Please Add a Name',
    });

    await toast.present();
  }



}
