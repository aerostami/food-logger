// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCo5gC_IfUSIas3Q85WXsH4SqGrs60SJ6M",
    authDomain: "uci-food-logger.firebaseapp.com",
    databaseURL: "https://uci-food-logger.firebaseio.com",
    projectId: "uci-food-logger",
    storageBucket: "uci-food-logger.appspot.com",
    messagingSenderId: "1037183118187",
    appId: "1:1037183118187:web:b12c64c6c412ccb1cf7a2e",
    measurementId: "G-HL4NGHDV3X",
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
