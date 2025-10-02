package ...

import android.os.Build
import android.os.Bundle
import android.content.Intent
import android.content.Context
import com.facebook.react.ReactActivity
import com.zoontek.rnbootsplash.RNBootSplash
import com.facebook.react.ReactActivityDelegate
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "name_of_application"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
      RNBootSplash.init(this, R.style.BootTheme)
      
      super.onCreate(savedInstanceState)

      handleNotificationAction(intent)
  }

  fun handleNotificationAction(intent: Intent?) {
    if (intent != null) {
        val notificationId = intent.getIntExtra("notification_id", -1)
        val isAnswer = intent.getBooleanExtra("answer", false)

        if (notificationId != -1 && isAnswer) {
            setCallStatusInPreferences(true)
            NotificationManagerCompat.from(this).cancel(notificationId)
        }
      }
  }

  private fun setCallStatusInPreferences(status: Boolean) {
        val sharedPreferences = applicationContext.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putBoolean("isCallAnsweredOrDeclined", status)
        editor.apply()
    }

  override fun onNewIntent(intent: Intent?) {
      super.onNewIntent(intent)
      handleNotificationAction(intent)
  }
}
