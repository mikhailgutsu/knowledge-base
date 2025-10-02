package ...

import android.content.Intent
import android.os.SystemClock
import android.content.Context
import android.app.PendingIntent
import com.xxxxxxxxxxxxx.MissedCallReceiver
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class MissedCallModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MissedCall"
    }
    
    @ReactMethod
    fun triggerMissedCallReceiver() {
        val missedCallIntent = Intent(reactApplicationContext, MissedCallReceiver::class.java)
        missedCallIntent.putExtra("manualTrigger", true)

        reactApplicationContext.sendBroadcast(missedCallIntent)
    }
}
