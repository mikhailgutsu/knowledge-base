import { openSettings } from 'react-native-permissions'

import { showAlert } from './showAlert'

export const showRequestTrackingTransparencyPermissionAlert = () => {
  return showAlert({
    cancelText: 'Cancel',
    onPressText: 'Open Settings',
    title: 'Tracking Transparency Permission Required',
    message: 'example requires tracking transparency access.',
    onPress: async () => {
      return await openSettings('application').catch((error) => {
        console.log('Cannot open settings', error)
      })
    },
    cancelable: true,
    onDismiss: () => {
      return showAlert({
        cancelText: 'Cancel',
        onPressText: 'Open Settings',
        title: 'Tracking Transparency Permission Required',
        message: 'example requires tracking transparency access.',
        onPress: async () => {
          return await openSettings('application').catch((error) => {
            console.log('Cannot open settings', error)
          })
        },
      })
    },
  })
}
