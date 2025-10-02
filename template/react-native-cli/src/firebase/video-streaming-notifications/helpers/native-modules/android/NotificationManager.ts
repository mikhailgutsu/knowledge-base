import { NativeModules } from 'react-native'

const { NotificationManager } = NativeModules

export const cancelNotification = (int: number): void => {
  if (
    NotificationManager &&
    typeof NotificationManager.cancelNotification === 'function'
  ) {
    try {
      return NotificationManager.cancelNotification(int)
    } catch (error) {
      console.error('Error cancelNotification:', error)
    }
  } else {
    console.error(
      'NotificationManager module is not available or cancelNotification is not a function'
    )
  }
}
