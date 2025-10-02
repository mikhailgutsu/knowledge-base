import { Linking } from 'react-native'
import messaging, { type FirebaseMessagingTypes } from '@react-native-firebase/messaging'

import { setStorageItem } from '@storage'

import type { LoggedInStackParamList } from './stacks/logged-in/logged-in.types'
import type { LinkingOptions, NavigatorScreenParams } from '@react-navigation/native'

type RootParamList = {
  HOME: NavigatorScreenParams<LoggedInStackParamList>
}

export const linking: LinkingOptions<RootParamList> = {
  prefixes: ['example://'],
  config: {
    screens: {
      HOME: {
        path: 'home',
        screens: {
          Call: 'call/:port/:serialNumber',
          Notifications: 'notifications',
        },
      },
    },
  },

  async getInitialURL() {
    const url = await Linking.getInitialURL()
    if (url) {
      console.log('Initial URL from Linking:', url)
      return url
    }

    const message = await messaging().getInitialNotification()

    console.log('App opened from quit state by notification:', message)

    const port = message?.data?.port
    const serialNumber = message?.data?.serialNumbber

    if (port && serialNumber) {
      await setStorageItem<string>('port', String(port))

      const deeplink = `example://home/call/${port}/${serialNumber}`

      console.log('Returning deep link URL:', deeplink)

      return deeplink
    }

    return null
  },

  subscribe(listener) {
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url)
    })

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Notification opened from background state:', remoteMessage)

        const port = remoteMessage.data?.port
        const serialNumber = remoteMessage?.data?.serialNumbber

        if (port && serialNumber) {
          await setStorageItem<string>('port', String(port))

          listener(`example://home/call/${port}/${serialNumber}`)
        }
      }
    )

    return () => {
      linkingSubscription.remove()
      unsubscribeNotificationOpened()
    }
  },
}
