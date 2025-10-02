import { NativeModules } from 'react-native'

const { LockedScreen } = NativeModules

export const isScreenLocked = async (): Promise<boolean | null> => {
  if (LockedScreen && typeof LockedScreen.isScreenLocked === 'function') {
    try {
      const isLocked = await LockedScreen.isScreenLocked()
      return isLocked
    } catch (error) {
      console.error('Error isScreenLocked:', error)
      return null
    }
  } else {
    console.error(
      'LockedScreen module is not available or isScreenLocked is not a function'
    )
    return null
  }
}
