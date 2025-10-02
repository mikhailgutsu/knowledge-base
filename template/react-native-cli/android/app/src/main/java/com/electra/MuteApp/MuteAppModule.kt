package ...

import android.content.Context
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class MuteAppModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var isMuteApp: Boolean = false

    override fun getName(): String {
        return "MuteApp"
    }

    @ReactMethod
    fun getMuteAppState(callback: Callback) {
        callback.invoke(isMuteApp)
    }

    @ReactMethod
    fun setMuteAppState(state: Boolean) {
    isMuteApp = state

    val sharedPreferences = reactApplicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
    sharedPreferences.edit().putBoolean("isMuteApp", state).apply()
    }
}
