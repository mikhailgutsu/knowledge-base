package ...

import android.os.IBinder
import android.app.Service
import android.content.Intent
import android.content.Context
import com.facebook.react.HeadlessJsTaskService
import androidx.core.app.NotificationManagerCompat

class RelayService : Service() {
      override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        NotificationManagerCompat.from(this).cancel(1)
        setCallStatusInPreferences(true)

        sendCallEventToJS("DECLINED")

        return START_NOT_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun sendCallEventToJS(status: String) {
        val intent = Intent(this, CallEventHeadlessTask::class.java).apply {
            putExtra("status", status)
        }
        startService(intent)
        HeadlessJsTaskService.acquireWakeLockNow(this)
    }

    private fun setCallStatusInPreferences(status: Boolean) {
        val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putBoolean("isCallAnsweredOrDeclined", status)
        editor.apply()
    }
}
