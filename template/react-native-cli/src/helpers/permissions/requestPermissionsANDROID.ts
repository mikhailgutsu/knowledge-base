import { PermissionsAndroid, type Permission } from 'react-native'

import { getFCMToken } from '@firebase/video-streaming-notifications/helpers'

import { ANDROID_VERSION } from 'src/constants'

export const requestPermissionsANDROID = async () => {
  try {
    if (ANDROID_VERSION >= 33) {
      const notificationResult = await requestPermission(REQUEST_PERMISSIONS.notification)

      if (notificationResult === PermissionsAndroid.RESULTS.GRANTED) {
        getFCMToken()
      }
    } else {
      getFCMToken()
    }

    await requestPermission(REQUEST_PERMISSIONS.microphone)

    await requestPermission(REQUEST_PERMISSIONS.camera)
  } catch (error) {
    console.error('Error requestPermissionsANDROID:', error)
  }
}

interface IRequestPermissionProps {
  title: string
  message: string
  permission: Permission
}

const requestPermission = async (requestPermissionProps: IRequestPermissionProps) => {
  const { title, message, permission } = requestPermissionProps

  const result = await PermissionsAndroid.request(permission)

  if (result === PermissionsAndroid.RESULTS.DENIED) {
    return PermissionsAndroid.request(permission, {
      title,
      message,
      buttonPositive: 'Accept',
      buttonNegative: 'Cancel',
    })
  }

  return result
}

const REQUEST_PERMISSIONS = {
  notification: {
    title: 'Notification Permission Required',
    permission: PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    message: "You can't receive calls without notification permission.",
  },
  camera: {
    title: 'Camera Permission Required',
    permission: PermissionsAndroid.PERMISSIONS.CAMERA,
    message: "You can't connect to the device without camera permission.",
  },
  microphone: {
    title: 'Microphone Permission Required',
    permission: PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    message: "You can't have access to speak without microphone permission.",
  },
} as const
