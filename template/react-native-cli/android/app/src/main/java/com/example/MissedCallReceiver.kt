package ...

import android.net.Uri
import android.content.Intent
import android.content.Context
import android.app.PendingIntent
import android.app.NotificationManager
import android.content.BroadcastReceiver
import androidx.core.content.ContextCompat
import androidx.core.app.NotificationCompat
import com.facebook.react.HeadlessJsTaskService
import androidx.core.app.NotificationManagerCompat

class MissedCallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        context?.let {
            val prefs = it.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
            val isAnswered = prefs.getBoolean("isCallAnsweredOrDeclined", false)
            val isManualTrigger = intent?.getBooleanExtra("manualTrigger", false) ?: false

            val serialNumber = prefs.getString("currentSerialNumber", "") ?: "Unknown Serial"

            if (isManualTrigger || !isAnswered) {
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.cancel(1)

                val missedIntent = Intent(it, CallEventHeadlessTask::class.java)
                missedIntent.putExtra("status", "MISSED")
                it.startService(missedIntent)
                HeadlessJsTaskService.acquireWakeLockNow(it)

                showMissedCallNotification(it, serialNumber)
            }
        }
    }

    private fun showMissedCallNotification(context: Context, serialNumber: String) {
        val missedCallIntent = Intent(context, MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse("xxx://home/notifications")
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context, 0, missedCallIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, "missedChannelId")
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentTitle("Missed Call")
            .setContentText("You missed a call from Intercom $serialNumber.")
            .setColor(ContextCompat.getColor(context, R.color.graphite))
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        NotificationManagerCompat.from(context).notify(2, builder.build())
    }
}
