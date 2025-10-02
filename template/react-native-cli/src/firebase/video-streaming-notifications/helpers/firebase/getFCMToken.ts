import messaging from '@react-native-firebase/messaging'

import { OS } from 'src/constants'

import { getStorageItem, setStorageItem } from '@storage'

export const getFCMToken = async () => {
  try {
    const authorizationStatus = await messaging().requestPermission()

    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      const fcmTokenStorage = await getStorageItem<string>('fcmToken')

      if (!fcmTokenStorage) {
        const fcmToken: string | null = await messaging().getToken()

        if (fcmToken) {
          await setStorageItem<string>('fcmToken', fcmToken)
          console.log(`FCM Token ${OS}:\n\t\t`, fcmToken)
        } else {
          console.warn('Failed to get FCM token')
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn('Error retrieving FCM token:', error.message)
    } else {
      console.warn('Unknown error retrieving FCM token')
    }
  }
}
