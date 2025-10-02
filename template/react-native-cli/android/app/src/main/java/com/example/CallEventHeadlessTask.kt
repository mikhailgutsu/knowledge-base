package ...

import android.content.Intent
import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class CallEventHeadlessTask  : HeadlessJsTaskService() {
     override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        val prefs: SharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)

        val status = intent?.getStringExtra("status") ?: "MISSED"
        val serialNumber = prefs.getString("currentSerialNumber", "") ?: "Unknown Serial"

        return HeadlessJsTaskConfig(
            "CallEvent",
            WritableNativeMap().apply {
                putString("status", status)
                putString("serialNumber", serialNumber)
            },
            65000,
            true
        )
    }
}
