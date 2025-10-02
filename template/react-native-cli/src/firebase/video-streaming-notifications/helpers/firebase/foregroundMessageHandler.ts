import { type FirebaseMessagingTypes } from '@react-native-firebase/messaging'

import { setStorageItem } from '@storage'

type RM = FirebaseMessagingTypes.RemoteMessage

export const foregroundMessageHandler = async (rm: RM) => {
  const port = rm.data?.port

  if (port) {
    await setStorageItem<string>('port', String(port))
  }

  return port
}
