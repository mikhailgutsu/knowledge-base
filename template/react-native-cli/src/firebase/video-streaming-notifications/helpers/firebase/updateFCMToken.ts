import { setStorageItem } from '@storage'

export const updateFCMToken = async (newToken: string) => {
  try {
    await setStorageItem<string>('fcmToken', newToken)
  } catch (error) {
    console.error('Error updating FCM token:', error)
  }
}
