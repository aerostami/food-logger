// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDwucONTRE7dMFwnuB_e4VKSuo9WFGcxDY",
    authDomain: "food-logger-uci.firebaseapp.com",
    databaseURL: "https://food-logger-uci.firebaseio.com",
    projectId: "food-logger-uci",
    storageBucket: "food-logger-uci.appspot.com",
    messagingSenderId: "1055247824931",
    appId: "1:1055247824931:web:19d981bc51c31630b95996",
    measurementId: "G-4QSGBR4F37"
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWVyb3N0YW1pIiwiYSI6ImNqMzQ3cTZqMjAwMjUzM29jbnd1Y2FqYnIifQ._oLFWriCyDLJC62mvt8UQw'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
