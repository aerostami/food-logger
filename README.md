# food-logger (camera branch)
## Bug needed to be fixed by yourself 
### Bug description
After running ionic capacitor build android and run the android studio, it may occur this error: `android.support.v4.content.FileProvider not found`
### Solution
Instead of `import android.support.v4.content.FileProvider;`

Try to `import androidx.core.content.FileProvider;`
### Ref
https://stackoverflow.com/questions/48534293/android-support-v4-content-fileprovider-not-found
