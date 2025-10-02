import { openSettings } from 'react-native-permissions'

import { showAlert } from './showAlert'

export const showRequestNotificationPermissionsAlert = () => {
  return showAlert({
    cancelText: 'Cancel',
    title: 'Notification Permission Required',
    onPressText: 'Open Settings',
    message: 'example requires notifications access to receive calls.',
    onPress: async () => {
      return await openSettings('notifications').catch((error) => {
        console.log('Cannot open notifications settings', error.message)
      })
    },
    cancelable: true,
    onDismiss: () => {
      return showAlert({
        cancelText: 'Cancel',
        title: 'Notification Permission Required',
        onPressText: 'Open Settings',
        message: 'example requires notifications access to receive calls.',
        onPress: async () => {
          return await openSettings('notifications').catch((error) => {
            console.log('Cannot open notifications settings', error.message)
          })
        },
      })
    },
  })
}
