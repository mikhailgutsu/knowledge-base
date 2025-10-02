import { NativeModules } from 'react-native'

const { Ringtone } = NativeModules

export const ringtoneSetter = (ringtone: string): void => {
  if (Ringtone && typeof Ringtone.setRingtone === 'function') {
    try {
      return Ringtone.setRingtone(ringtone)
    } catch (error) {
      console.error('Error setRingtone:', error)
    }
  } else {
    console.error('Ringtone module is not available or setRingtone is not a function')
  }
}
