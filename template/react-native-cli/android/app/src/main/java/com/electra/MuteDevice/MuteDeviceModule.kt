package ...

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.*

class MuteDeviceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val sharedPreferences: SharedPreferences =
        reactApplicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)

    override fun getName(): String {
        return "MuteDevice"
    }

    @ReactMethod
    fun muteDevice(serialNumber: String, state: Boolean) {
        val mutedDevices = getMutedDevices().toMutableSet()
        val deviceKey = "$serialNumber"

        if (state) {
            mutedDevices.add(deviceKey) 
        } else {
            mutedDevices.remove(deviceKey)
        }

        sharedPreferences.edit().putStringSet("mutedDevices", mutedDevices).apply()

    }

    @ReactMethod
    fun isDeviceMuted(serialNumber: String,  callback: Callback) {
        val mutedDevices = getMutedDevices()
        val isMuted = mutedDevices.contains("$serialNumber")

        callback.invoke(isMuted)
    }

     private fun getMutedDevices(): Set<String> {
        val mutedDevices = sharedPreferences.getStringSet("mutedDevices", emptySet()) ?: emptySet()

        return mutedDevices
    }
}
