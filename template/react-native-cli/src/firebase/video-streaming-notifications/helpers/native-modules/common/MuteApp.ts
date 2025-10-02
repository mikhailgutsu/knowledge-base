import { NativeModules } from 'react-native'

const { MuteApp } = NativeModules

export const muteApp = (state: boolean): void => {
  if (MuteApp && typeof MuteApp.setMuteAppState === 'function') {
    try {
      return MuteApp.setMuteAppState(state)
    } catch (error) {
      console.error('Error setMuteAppState:', error)
    }
  } else {
    console.error('MuteApp module is not available or setMuteAppState is not a function')
  }
}
