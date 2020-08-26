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
  private currentDate: Date;
  private myDate: string;
  private username: string;

  public FoodStream = new Subject<any>();
  public foods: Observable<any[]>;

  constructor(
      private fs: AngularFirestore,
      private as: AuthService,
      private router: Router
  ) {


    this.as.getUserLoginStream().subscribe(v => {
          this.username = v;
          this.currentDate = new Date();
          this.dateCollection = this.fs.collection<User>('users/'+ this.username + '/' + this.myDate);
          this.foods = this.dateCollection.valueChanges(['added']);
          console.log('username: ', this.username)

        }

    );

    this.myDate = formatDate(new Date(), 'yyyyMMdd', 'en')

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
  public getTodayFood() {
    return this.foods;
  }

  public getMonthFoods() {
    var days = endOfMonth(this.currentDate);
    for (var i=1; i <= days.getDate();i++ ) {
      var date = formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i), 'yyyyMMdd', 'en');
      var temp_foodsCollection = this.fs.collection<any>('users/'+ this.username + '/' + date);
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
    const itemDoc = this.fs.doc('users/'+ this.username + '/' + date_s + '/' + id);
    itemDoc.delete();
  }

  public addItem(data: any) {
    this.router.navigate(["/","logger","addfood"]);
    //this.dateCollection.add(data);
  }

  public updateItem(oldid: any, data: any, oldDate: Date, newDate: Date) {
    const date_s = formatDate(oldDate, 'yyyyMMdd', 'en');
    const itemDoc = this.fs.doc('users/'+ this.username + '/' + date_s + '/' + oldid);

    itemDoc.delete();
    this.logfood(data, newDate);

  }

  public logfood(data: any, date: Date) {
    var date_s = formatDate(date, 'yyyyMMdd', 'en');
    var dateCollection = this.fs.collection<User>('users/'+ this.username + '/' + date_s);
    var id = this.fs.createId();

    var item = { ...data, 'id': id };
    dateCollection.doc(id).set(item);
  }

}
