package ...

import android.os.Looper
import android.os.Handler
import android.os.Process
import android.app.Activity
import android.content.Context
import android.app.ActivityManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ExitAppModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ExitApp"
    }

    @ReactMethod
    fun exitApp() {
        Handler(Looper.getMainLooper()).post {
            val activity = currentActivity
            if (activity != null) {
                val activityManager = activity.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
                activityManager.appTasks.forEach { it.setExcludeFromRecents(true) }

                activity.finishAffinity()
            }

            Process.killProcess(Process.myPid())
            System.exit(0)
        }
    }
}
