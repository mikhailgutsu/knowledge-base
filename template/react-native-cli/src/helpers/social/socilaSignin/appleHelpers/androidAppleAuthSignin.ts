import {
  appleAuthAndroid,
  type AppleRequestResponseFullName,
} from '@invertase/react-native-apple-authentication'

import {
  uuid,
  appleError,
  decodedJWT,
  getAppleFullName,
  handleAuthRestTimesWithoutEmail,
} from './index'
import { getStorageItem, setStorageItem } from '@storage'

import env from '@env'

import type { ISocialSigninApple, SocialType } from '@typings/social'

export const androidAppleAuthSignin = async (
  appleSignin: ISocialSigninApple
): Promise<void> => {
  const { handleAuth, dispatch, toast } = appleSignin

  try {
    const state = uuid()
    const rawNonce = uuid()

    appleAuthAndroid.isSupported &&
      appleAuthAndroid.configure({
        clientId: env.SERVICE_CLIENT_ID,
        redirectUri: env.SERVICE_REDIRECT_URI,
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
        nonce: rawNonce,
        state,
      })

    const { id_token, user } = await appleAuthAndroid.signIn()

    const email = user?.email!

    const givenName = user?.name?.firstName ?? ''
    const familyName = user?.name?.lastName ?? ''
    const appleFullNameObj: Partial<AppleRequestResponseFullName> = {
      givenName,
      familyName,
    }

    const fullName = getAppleFullName({ appleFullNameObj })

    if (id_token) {
      const { sub: appleUserId } = decodedJWT(id_token)

      await setStorageItem('APPLE_USER_ID', JSON.stringify(appleUserId))

      const mobileToken = await getStorageItem<string>('fcmToken')

      if (mobileToken !== null) {
        if (!email) {
          // rest times login
          return handleAuthRestTimesWithoutEmail({
            toast,
            dispatch,
            mobileToken,
            appleUserId,
          })
        }

        // first time login
        await setStorageItem<Extract<SocialType, 'apple'>>('SOCIAL_TYPE', 'apple')
        return handleAuth({ email, fullName, appleUserId, mobileToken })
      }
    }
  } catch (error) {
    appleError(error)
  }
}
