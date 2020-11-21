import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/service/auth.service';
import { FsService } from './logger/service/fs.service';
import { Router } from '@angular/router';

import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private as: AuthService,
      private fs: FsService,
      private router: Router,
      private fcm: FCM
  ) {
    this.initializeApp();
    this.router.navigate(['']);

    // ionic push notification example
    this.fcm.onNotification().subscribe(data => {
      console.log("push");
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
      }
    });

    // refresh the FCM token
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log(token);
    });
  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
