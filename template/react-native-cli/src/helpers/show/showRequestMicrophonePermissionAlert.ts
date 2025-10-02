import { openSettings } from 'react-native-permissions'

import { showAlert } from './showAlert'

export const showRequestMicrophonePermissionAlert = () => {
  return showAlert({
    cancelText: 'Cancel',
    onPressText: 'Open Settings',
    title: 'Microphone Permission Required',
    message: 'example requires microphone access to answer calls.',
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
        title: 'Microphone Permission Required',
        message: 'example requires microphone access to answer calls.',
        onPress: async () => {
          return await openSettings('application').catch((error) => {
            console.log('Cannot open settings', error)
          })
        },
      })
    },
  })
}
