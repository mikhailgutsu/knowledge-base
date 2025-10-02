package ...

import android.app.KeyguardManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class LockedScreenModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "LockedScreen"

    @ReactMethod
    fun isScreenLocked(promise: Promise) {
        val keyguardManager = reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
        val isLocked = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            keyguardManager.isKeyguardLocked 
        } else {
            false
        }
        promise.resolve(isLocked)
    }
}
