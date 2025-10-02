import { useToast } from 'react-native-toast-notifications'
import { Dispatch, type UnknownAction } from '@reduxjs/toolkit'
import type { AppleRequestResponseFullName as IAppleRequestResponseFullName } from '@invertase/react-native-apple-authentication'

export interface IAuthParams {
  email: string
  mobileToken: string
  appleUserId?: string
  fullName: IAppleRequestResponseFullName | string | null
}

export interface ISocialSingninResponse {
  token: string
}

export interface ISocialSignin {
  handleAuth: (authParams: IAuthParams) => Promise<void>
}

export interface ISigninAppleArgs {
  dispatch: Dispatch<UnknownAction>
  toast: ReturnType<typeof useToast>
}

export type ISocialSigninApple = ISigninAppleArgs & ISocialSignin

export type SocialType = 'google' | 'facebook' | 'apple'
