import {
  RESULTS,
  PERMISSIONS,
  requestMultiple,
  requestNotifications,
} from 'react-native-permissions'

import { getFCMToken } from '@firebase/video-streaming-notifications/helpers'

export const requestPermissionsIOS = async () => {
  try {
    await requestNotifications(['alert', 'sound', 'badge']).then(
      async (notificationStatus) => {
        if (notificationStatus.status === RESULTS.GRANTED) {
          console.log('notificationStatus', notificationStatus.status)
          await getFCMToken()
        }
      }
    )

    await requestMultiple([
      PERMISSIONS.IOS.MICROPHONE,
      PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
      PERMISSIONS.IOS.CAMERA,
    ])
  } catch (error) {
    console.error('Error in requestPermissionsIOS:', error)
  }
}
