import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { googleError } from './googleHelpers'
import { getStorageItem, setStorageItem } from '@storage'

import type { ISocialSignin, SocialType } from '@typings/social'

export const googleSignin = async (googleSignin: ISocialSignin) => {
  const { handleAuth } = googleSignin

  try {
    await GoogleSignin.hasPlayServices()

    const { type, data } = await GoogleSignin.signIn()

    if (type === 'success' && data.user.email) {
      await setStorageItem<Extract<SocialType, 'google'>>('SOCIAL_TYPE', 'google')

      const mobileToken = await getStorageItem<string>('fcmToken')

      if (mobileToken !== null) {
        return handleAuth({
          mobileToken,
          email: data.user.email,
          fullName: data.user.name ?? '',
        })
      }
    }
  } catch (error: unknown) {
    googleError(error)
  }
}
