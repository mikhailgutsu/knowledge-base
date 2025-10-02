import { appleAuth } from '@invertase/react-native-apple-authentication'

import { getStorageItem, setStorageItem } from '@storage'
import { appleError, getAppleFullName, handleAuthRestTimesWithoutEmail } from './index'

import type { ISocialSigninApple, SocialType } from '@typings/social'

export const appleAuthSingin = async (appleSignin: ISocialSigninApple): Promise<void> => {
  const { handleAuth, dispatch, toast } = appleSignin

  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    )

    if (credentialState !== appleAuth.State.AUTHORIZED) {
      if (__DEV__) {
        console.info('User cancelled Apple login flow')
      }

      return
    }

    const {
      email,
      user: appleUserId,
      fullName: appleFullNameObj,
    } = appleAuthRequestResponse

    await setStorageItem('APPLE_USER_ID', JSON.stringify(appleUserId))

    const fullName = getAppleFullName({ appleFullNameObj })

    const mobileToken = await getStorageItem<string>('fcmToken')

    if (mobileToken !== null) {
      if (!email) {
        // rest times login
        return handleAuthRestTimesWithoutEmail({
          toast,
          dispatch,
          appleUserId,
          mobileToken,
        })
      }

      // first time login
      await setStorageItem<Extract<SocialType, 'apple'>>('SOCIAL_TYPE', 'apple')
      return handleAuth({ email, fullName, appleUserId, mobileToken })
    }
  } catch (error) {
    appleError(error)
  }
}
