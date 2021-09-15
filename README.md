# food-logger (camera branch)

## Bugs
These Bugs may occur after build android or ios, and you need to fix them according to the solutions shown below.

### Build Android
#### Bug 1
##### Description
After running ionic capacitor build android and run the android studio, it may occur this error: `android.support.v4.content.FileProvider not found`
##### Solution
Instead of `import android.support.v4.content.FileProvider;`

Try to `import androidx.core.content.FileProvider;`
##### Ref
https://stackoverflow.com/questions/48534293/android-support-v4-content-fileprovider-not-found

### Build IOS
#### Bug 1
##### Description
The camera doesn't work on Xcode simulator, so you need a real iPhone to test the food image logging and barcode scanning features.
According to refs shown below, you need to add several descriptions in config.xml for the access to camera, voice, location...on iPhone.

However, they still may not be included in Info.plist and the app may crash after trying to access camera.
##### Solution
Add these descriptions manually in Info.plist file of IOS folder after building IOS.

![img](/images/needtoaddmanually.png)
##### Ref
[https://www.twilio.com/blog/2018/07/how-to-test-your-ios-application-on-a-real-device.html](https://www.twilio.com/blog/2018/07/how-to-test-your-ios-application-on-a-real-device.html)

[https://ionicframework.com/docs/native/camera](https://ionicframework.com/docs/native/camera)

[https://github.com/apache/cordova-plugin-camera](https://github.com/apache/cordova-plugin-camera)

[https://stack247.wordpress.com/2018/12/26/ionic-plugin-camera-crash/](https://stack247.wordpress.com/2018/12/26/ionic-plugin-camera-crash/)

[https://stack247.wordpress.com/2018/12/26/ionic-plugin-camera-info-plist/](https://stack247.wordpress.com/2018/12/26/ionic-plugin-camera-info-plist/)

[https://stackoverflow.com/questions/39465687/nscamerausagedescription-in-ios-10-0-runtime-crash](https://stackoverflow.com/questions/39465687/nscamerausagedescription-in-ios-10-0-runtime-crash)
