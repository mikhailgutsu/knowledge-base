package ...

import android.content.Context
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class RingtoneModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var Ringtone: String = ""
    
    override fun getName(): String {
        return "Ringtone"
    }

    @ReactMethod
    fun getRingtone(callback: Callback) {
        callback.invoke(Ringtone)
    }

    @ReactMethod
    fun setRingtone(ringtone: String) {
        Ringtone = ringtone
        val sharedPreferences = reactApplicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
        sharedPreferences.edit().putString("ringtone", ringtone).apply()
    }
}