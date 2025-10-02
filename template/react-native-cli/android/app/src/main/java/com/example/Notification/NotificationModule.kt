package ...

import android.content.Context
import com.facebook.react.bridge.ReactMethod
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class NotificationManagerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "NotificationManager"
    }

    @ReactMethod
    fun cancelNotification(notificationId: Int) {
        val context: Context = reactApplicationContext
        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.cancel(notificationId)
    }
}