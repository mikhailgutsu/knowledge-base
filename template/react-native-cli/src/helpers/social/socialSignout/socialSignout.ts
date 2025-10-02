import { LoginManager } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { getStorageItem } from '@storage'

import type { SocialType } from '@typings/social'

export const socialSignout = async () => {
  const socialType = await getStorageItem<SocialType>('SOCIAL_TYPE')

  if (socialType === 'google') {
    console.log('Logging out from google')
    return await GoogleSignin.revokeAccess()
  }

  if (socialType === 'facebook') {
    console.log('Logging out from Facebook')
    return LoginManager.logOut()
  }

  if (socialType === 'apple') {
    return console.log('Logging out from apple')
  }

  return
}
