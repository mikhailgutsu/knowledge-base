import { openSettings } from 'react-native-permissions'

import { showAlert } from './showAlert'

export const showRequestCameraPermissionAlert = () => {
  return showAlert({
    cancelText: 'Cancel',
    onPressText: 'Open Settings',
    title: 'Camera Permission Required',
    message: 'example requires camera access to scan QR codes.',
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
        title: 'Camera Permission Required',
        message: 'example requires camera access to scan QR codes.',
        onPress: async () => {
          return await openSettings('application').catch((error) => {
            console.log('Cannot open settings', error)
          })
        },
      })
    },
  })
}
