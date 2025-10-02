import { isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'

export const googleError = (error: unknown) => {
  if (__DEV__ && isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.IN_PROGRESS:
        console.log('in progress')
        break
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        console.log('play services not available or outdated')
        break
      default:
        console.log('Something went wrong: ', error.toString())
    }
  } else {
    console.log(`an error that's not related to google sign in occurred`)
  }
}
