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
  private dateCollection: AngularFirestoreCollection;
  private itemDoc: AngularFirestoreDocument;
  private currentDate: Date;
  private myDate: string;
  private userId: string;

  public FoodStream = new Subject<any>();
  public foods: Observable<any[]>;

  constructor(
      private afs: AngularFirestore,
      private as: AuthService,
      private router: Router
  ) {


    this.as.getUserLoginStream().subscribe(v => {
          this.userId = v;
          this.currentDate = new Date();
          this.myDate = formatDate(new Date(), 'yyyyMMdd', 'en')
          this.dateCollection = this.afs.collection<User>('users/'+ this.userId + '/' + this.myDate);
          this.foods = this.dateCollection.valueChanges(['added']);
          this.itemDoc = afs.doc<User>('users/' + this.userId)
        }

    );

    

  }
  public getFoodStream() {
    return this.FoodStream.asObservable();
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

  private updateDate(){
    this.currentDate = new Date();
    this.myDate = formatDate(new Date(), 'yyyyMMdd', 'en')
    this.dateCollection = this.afs.collection<User>('users/'+ this.userId + '/' + this.myDate);
    this.foods = this.dateCollection.valueChanges(['added']);
  }

  public getTodayFood() {
    this.updateDate();
    return this.foods;
  }

  public getMonthFoods() {
    var days = endOfMonth(this.currentDate);
    for (var i=1; i <= days.getDate();i++ ) {
      var date = formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i), 'yyyyMMdd', 'en');
      var temp_foodsCollection = this.afs.collection<any>('users/'+ this.userId + '/' + date);
      var temp_foods = temp_foodsCollection.valueChanges();

      temp_foods.forEach(item => item.forEach(v => {
            var time = v.date.toDate();

            this.FoodStream.next({'food': v.food.food_name, 'date': time, 'id': v.id});
          })
      );

    }

  }


  public deleteItem(id: any, date: Date) {
    const date_s = formatDate(date, 'yyyyMMdd', 'en');
    const itemDoc = this.afs.doc('users/'+ this.userId + '/' + date_s + '/' + id);
    itemDoc.delete();
  }

 

  public updateItem(oldid: any, data: any, oldDate: Date, newDate: Date) {
    const date_s = formatDate(oldDate, 'yyyyMMdd', 'en');
    const itemDoc = this.afs.doc('users/'+ this.userId + '/' + date_s + '/' + oldid);

    itemDoc.delete();
    this.logfood(data, newDate);

  }

  public logfood(data: any, date: Date) {
    var date_s = formatDate(date, 'yyyyMMdd', 'en');
    var dateCollection = this.afs.collection<User>('users/'+ this.userId + '/' + date_s);
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
    this.router.navigate(['/logger/admin'])
  }



  public createNewRecipeList(data) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.userId}`);
    userRef.set(data, {
      merge: true
    })
    this.router.navigate(['/logger/recipe'])
  }

  public getRecipes() {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.userId}`);
    return userRef.valueChanges();
    
  }

 

}
