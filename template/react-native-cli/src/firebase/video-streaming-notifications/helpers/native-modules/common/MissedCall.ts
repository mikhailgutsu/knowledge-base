import { NativeModules } from 'react-native'

import { OS } from 'src/constants'

const { MissedCall } = NativeModules

export const missedCall = (): void => {
  if (MissedCall) {
    try {
      if (OS === 'android') {
        MissedCall.triggerMissedCallReceiver()
      }

      if (OS === 'ios') {
        MissedCall.setMissedCall(true)
      }
    } catch (error) {
      console.error('Error MissedCall:', error)
    }
  } else {
    console.error(
      'MissedCall module is not available or triggerMissedCallReceiver is not a function'
    )
  }
}
