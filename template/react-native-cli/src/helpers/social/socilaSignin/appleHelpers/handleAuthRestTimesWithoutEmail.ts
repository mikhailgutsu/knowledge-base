import axios from 'axios'

import { setStorageItem } from '@storage'
import { useToast } from 'react-native-toast-notifications'
import { saveAuthState } from '@store/authState/authState.actions'

import env from '@env'
import { AUTH_SOCIALS_APPLE_SIGNIN_ENDPOINT, USER_DATA_ENDPOINT } from '@endpoints'

import type { SocialType } from '@typings/social'
import type { ICurrentUserResponse } from '@typings/user'
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit'

type IAppleSigninWithoutEmail = {
  appleUserId: string
  mobileToken: string
  dispatch: Dispatch<UnknownAction>
  toast: ReturnType<typeof useToast>
}

export const handleAuthRestTimesWithoutEmail = async (
  appleSigninWithoutEmail: IAppleSigninWithoutEmail
) => {
  const { appleUserId, mobileToken, dispatch, toast } = appleSigninWithoutEmail

  try {
    const payload = { appleUserId, mobileToken }

    const { data } = await axios.post(
      `${env.API}${AUTH_SOCIALS_APPLE_SIGNIN_ENDPOINT}`,
      payload
    )

    if (!data.token) {
      console.log('Token not received from Apple Sign-In API')
      return
    }

    await setStorageItem<string>(env.USER_TOKEN, data.token)

    const config = { headers: { Authorization: `Bearer ${data.token}` } }

    const { data: userData } = await axios.get(`${env.API}${USER_DATA_ENDPOINT}`, config)

    await setStorageItem<Extract<SocialType, 'apple'>>('SOCIAL_TYPE', 'apple')
    await setStorageItem<ICurrentUserResponse>('currentUser', userData)

    dispatch(saveAuthState(true))
    return setStorageItem<boolean>('isAuthenticated', true)
  } catch (error) {
    toast.show('Server error', { type: 'danger' })
  }
}
