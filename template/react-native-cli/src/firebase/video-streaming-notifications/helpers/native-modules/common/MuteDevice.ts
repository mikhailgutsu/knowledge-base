import { NativeModules } from 'react-native'

const { MuteDevice } = NativeModules

export const muteDevice = (serialNumber: string, state: boolean): void => {
  if (MuteDevice && typeof MuteDevice.muteDevice === 'function') {
    try {
      return MuteDevice.muteDevice(serialNumber, state)
    } catch (error) {
      console.error('Error muteDevice:', error)
    }
  } else {
    console.error('MutDevice module is not available or muteDevice is not a function')
  }
}
