import axios from 'axios'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'

import { getStorageItem, setStorageItem } from '@storage'
import { facebookUrl, facebookError } from './facebookHelpers'

import type { ISocialSignin, SocialType } from '@typings/social'

export const facebookSignin = async (facebookSignin: ISocialSignin) => {
  const { handleAuth } = facebookSignin

  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])

    if (result.isCancelled) {
      __DEV__ && console.info('User cancelled Facebook login flow')
      return
    }

    const data = await AccessToken.getCurrentAccessToken()

    if (data) {
      await setStorageItem<Extract<SocialType, 'facebook'>>('SOCIAL_TYPE', 'facebook')

      if (data.accessToken) {
        console.log('Facebook API Response:', data.accessToken)

        const FACEBOOK_URL = facebookUrl(data.accessToken)

        await axios.get(FACEBOOK_URL).then(async (response) => {
          if (response.data.email) {
            const mobileToken = await getStorageItem<string>('fcmToken')

            if (mobileToken !== null) {
              handleAuth({
                mobileToken,
                email: response.data.email,
                fullName: response.data.name ?? '',
              })
            }
          }
        })
      }
    }
  } catch (error) {
    facebookError(error)
  }
}
