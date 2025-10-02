import { NativeModules } from 'react-native'

const { ExitApp } = NativeModules

export const exitApp = (): void => {
  if (ExitApp && typeof ExitApp.exitApp === 'function') {
    try {
      return ExitApp.exitApp()
    } catch (error) {
      console.error('Error exitApp:', error)
    }
  } else {
    console.error('ExitApp module is not available or exitApp is not a function')
  }
}
