import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { User } from '../../types/User.interface'
import {formatDate} from '@angular/common';
import { map, timestamp } from 'rxjs/operators';
import { AuthService } from '../../auth/service/auth.service';
import { Router } from '@angular/router';
import { endOfMonth, } from 'date-fns';

import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FsService {
  private foodDataCollection: AngularFirestoreCollection;
  private eventDataCollection: AngularFirestoreCollection;
  private itemDoc: AngularFirestoreDocument;
  private currentDate: Date;
  private myDate: string;
  private userId: string;
  private foodPath = '/logs/foodLogs/';
  private eventPath = '/logs/eventLogs/';
  private recipePath = '/logs/Recipes';

  public AddFoodStream = new Subject<any>();
  public DeleteFoodStream = new Subject<any>();
  public foods: Observable<any[]>;
  public events: Observable<any[]>;

  constructor(
      private afs: AngularFirestore,
      private as: AuthService,
      private router: Router
  ) {


    this.as.getUserLoginStream().subscribe(v => {
          this.userId = v;
          this.currentDate = new Date();
          this.myDate = formatDate(new Date(), 'yyyyMMdd', 'en')
          this.foodDataCollection = this.afs.collection<User>('users/' + this.userId + this.foodPath + this.myDate);
          this.foods = this.foodDataCollection.valueChanges();

          this.eventDataCollection = this.afs.collection<User>('users/' + this.userId + this.eventPath + this.myDate);
          this.events = this.eventDataCollection.valueChanges();
          this.itemDoc = afs.doc<User>('users/' + this.userId);
        }

    );

    

  }
  public getAddFoodStream() {
    return this.AddFoodStream.asObservable();
  }
  public getDeleteFoodStream() {
    return this.DeleteFoodStream.asObservable();
  }

  public getDate() {
    return this.currentDate;
  }
  public getStringDate() {
    return this.myDate;
  }
  public getMinute() {
    var minute = this.currentDate.getMinutes();
    return minute;
  }
  public getHour() {
    var hour = this.currentDate.getHours();
    return hour;
  }

  public convertTimeStampToDate(timestamp) {
    return timestamp.toDate();
  }

  private updateDate(){
    this.currentDate = new Date();
    this.myDate = formatDate(new Date(), 'yyyyMMdd', 'en')
    this.foodDataCollection = this.afs.collection<User>('users/'+ this.userId + this.foodPath + this.myDate);
    this.foods = this.foodDataCollection.valueChanges(['added']);
  }

  public getTodayFood() {
    this.updateDate();
    return this.foods;
  }
  public getTodayEvent() {
    this.updateDate();
    return this.events;
  }

  public getMonthFoods() {
    var days = endOfMonth(this.currentDate);
    
    for (var i=1; i <= days.getDate();i++ ) {
      var date = formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i), 'yyyyMMdd', 'en');
      this.afs.collection<any>('users/'+ this.userId + this.foodPath + date)
      .stateChanges(['added', 'removed']).pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          const type = a.type;

          return {'data':data, 'type':type};
        }))
      ).subscribe(item => item.forEach((data) => {
        if (data.type=="added") {
          this.AddFoodStream.next({...data.data});
        } else if (data.type=="removed") {
          this.DeleteFoodStream.next({...data.data});
        }
            
        })
      );
      

    }

  }


  public deleteItem(id: any, date: Date) {
    const date_s = formatDate(date, 'yyyyMMdd', 'en');
    const itemDoc = this.afs.doc('users/'+ this.userId + this.foodPath + date_s + '/' + id);
    itemDoc.delete();
  }

  public deleteItemEvent(id: any, date: Date) {
    const date_s = formatDate(date, 'yyyyMMdd', 'en');
    const itemDoc = this.afs.doc('users/'+ this.userId + this.eventPath + date_s + '/' + id);
    itemDoc.delete();
  }
 

  public updateItem(oldid: any, data: any, oldDate: Date, newDate: Date) {
    const date_s = formatDate(oldDate, 'yyyyMMdd', 'en');
    const itemDoc = this.afs.doc('users/'+ this.userId + this.foodPath + date_s + '/' + oldid);

    itemDoc.delete();
    this.logfood(data, newDate);

  }

  public logfood(data: any, date: Date) {
    var date_s = formatDate(date, 'yyyyMMdd', 'en');
    var dateCollection = this.afs.collection<User>('users/'+ this.userId + this.foodPath + date_s);
    var id = this.afs.createId();

    var item = { ...data, 'id': id };
    dateCollection.doc(id).set(item);
  }

  public logEvent(data: any, date: Date) {
    var date_s = formatDate(date, 'yyyyMMdd', 'en');
    var dateCollection = this.afs.collection<User>('users/'+ this.userId + this.eventPath + date_s);
    var id = this.afs.createId();

    var item = { ...data, 'id': id };
    dateCollection.doc(id).set(item);
  }


  public getUserInfo() {
    return this.itemDoc.valueChanges();
  }

  public logUserInfo(data) {
    this.itemDoc.set(data, 
      {merge: true});
    this.router.navigate(['/logger/admin']);
  }



  public createNewRecipeList(data) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.userId}`+this.recipePath);
    userRef.set(data, {
      merge: true
    })
    this.router.navigate(['/logger/recipe'])
  }

  public getRecipes() {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.userId}`+this.recipePath);
    return userRef.valueChanges();
    
  }

  public addRecipeToFood(recipe) {
    var calorie = 0;
    var protein = 0;
    var sugar = 0;
    var carb = 0;
    var fat = 0;
    recipe.intergredients.forEach((element) => {
      calorie += element.amount * element.intergredient.nf_calories
      protein += element.amount * element.intergredient.nf_protein
      sugar += element.amount * element.intergredient.nf_sugars
      carb += element.amount * element.intergredient.nf_total_carbohydrate
      fat += element.amount * element.intergredient.nf_total_fat
    });
    if (recipe.photo != undefined) {
      var photo = recipe.photo
    } else{
      var photo = recipe.intergredients[0].intergredient.photo
    }
    var food = {...recipe, 
    'isRecipe':true,
    'nf_calories':calorie,
    'nf_protein':protein,
    'nf_sugars':sugar,
    'nf_total_carbohydrate':carb,
    'nf_total_fat':fat,
    'photo':photo,
    }

    var food_list = []
    food_list.push(food)
    localStorage.setItem("recipe_food", JSON.stringify(food_list))
    this.router.navigate(["/","logger","logfood"]);
  }

 

}
