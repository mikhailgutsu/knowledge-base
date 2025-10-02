package ...

// Android OS and System Services
import android.app.Person
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.app.AlarmManager

// AndroidX Support Libraries
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.IconCompat
import com.facebook.react.HeadlessJsTaskService

// Firebase Messaging
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class FirebaseMsgService : FirebaseMessagingService() {

    private var missedCallHandler: Handler? = null
    private var missedCallRunnable: Runnable? = null

    override fun onCreate() {
        super.onCreate()
        createMissedCallNotificationChannel()
    }

    private fun getCallStatusFromPreferences(): Boolean {
        val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
        return sharedPreferences.getBoolean("isCallAnsweredOrDeclined", false)
    }

     private fun setCallStatusInPreferences(status: Boolean) {
        val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putBoolean("isCallAnsweredOrDeclined", status)
        editor.apply()
    }

    private fun getMuteAppStateFromPreferences(): Boolean {
       val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
       return sharedPreferences.getBoolean("isMuteApp", false)
    }

    private fun getRingtoneFromPreferences(): String {
       val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
       return sharedPreferences.getString("ringtone", "") ?: ""
    }

    private fun isDeviceMuted(serialNumber: String): Boolean {
       val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
       val mutedDevices = sharedPreferences.getStringSet("mutedDevices", emptySet()) ?: emptySet()
       return mutedDevices.contains("$serialNumber")
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val port = remoteMessage.data["port"]
        val serialNumber = remoteMessage.data["serialNumbber"]

        val isMuteApp = getMuteAppStateFromPreferences()
        setCallStatusInPreferences(false)

        if (!serialNumber.isNullOrEmpty() && !port.isNullOrEmpty()) {
            val isMuted = isDeviceMuted(serialNumber)
            
            if (isMuted || isMuteApp) {
                 return
            }
            val ringtoneUri = getRingtoneFromPreferences()
            val channelId = createNotificationChannel(ringtoneUri)
            showCallNotification(port, channelId, serialNumber)
        }
    }

    private fun showCallNotification(port: String, channelId: String, serialNumber: String) {
        val notificationId = 1

         val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
         val editor = sharedPreferences.edit()
         editor.putString("currentSerialNumber", serialNumber)
         editor.apply()

        val mainIntent = Intent(this, MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse("xxx://home/call/$port/$serialNumber")
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingMainIntent = PendingIntent.getActivity(
            this, 0, mainIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val answerIntent = Intent(this, MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse("xxx://home/call/$port/$serialNumber")
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("notification_id", notificationId)
            putExtra("answer", true)
        }
        val answerPendingIntent = PendingIntent.getActivity(
            this, 1, answerIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val declineIntent = Intent(this, RelayService::class.java).apply {
            putExtra("action", "decline")
        }
        val declinePendingIntent = PendingIntent.getService(
            this, 2, declineIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val incomingCaller = Person.Builder()
            .setName("Intercom")
            .setImportant(true)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val builder = Notification.Builder(this, channelId)
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentText("Call from device: $serialNumber")
                .setColorized(true)
                .setAutoCancel(true)
                .setOnlyAlertOnce(true)
                .setFullScreenIntent(pendingMainIntent, true)
                .setCategory(Notification.CATEGORY_CALL)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setStyle(Notification.CallStyle.forIncomingCall(incomingCaller, declinePendingIntent, answerPendingIntent))


            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(1, builder.build())
           
            scheduleMissedCallCheck()

        } else {
            val builder = NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentText("Call from device: $serialNumber")
                .setColorized(true)
                .setAutoCancel(true)
                .setOnlyAlertOnce(true)
                .setFullScreenIntent(pendingMainIntent, true)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setColor(ContextCompat.getColor(this, R.color.graphite))
                .addAction(
                    R.drawable.ic_caller, "Answer", answerPendingIntent
                )
                .addAction(
                    R.drawable.ic_caller, "Decline", declinePendingIntent
                )

            with(NotificationManagerCompat.from(this)) {
                notify(1, builder.build())
            }
       
        scheduleMissedCallCheck()
        }
    }

    private fun scheduleMissedCallCheck() {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val missedCallIntent = Intent(this, MissedCallReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            this, 100, missedCallIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.setExact(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + 60000, pendingIntent)
    }

    private fun createNotificationChannel(ringtoneUri: String): String {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            
            notificationManager.notificationChannels.forEach { channel ->
                if (channel.id.startsWith("video_channel_")) {
                    notificationManager.deleteNotificationChannel(channel.id)
                }
            }

            val channelId = "video_channel_${ringtoneUri.hashCode()}"
            val soundUri: Uri = Uri.parse(ringtoneUri)

            val channelName = "Video Channel"
            val channelDescription = "Video Channel Streaming"
            val importance = NotificationManager.IMPORTANCE_HIGH

            val channel = NotificationChannel(channelId, channelName, importance).apply {
                description = channelDescription
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 1000, 500, 1000)

                val audioAttributes = AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                    .build()
                setSound(soundUri, audioAttributes)

                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }

            notificationManager.createNotificationChannel(channel)
        return channelId
        }
       return "video_channel_id"
    }

    private fun createMissedCallNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "missedChannelId",
                "Missed Call Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for missed intercom calls"
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 500, 500)
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(channel)
        }
    }
}
