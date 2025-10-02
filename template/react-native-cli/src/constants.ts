import { Dimensions, Platform } from 'react-native'

import type { IPasswordValidationKeys } from '@typings/password'
import type { INotificationSound } from './hooks/native-modules/useSound'

export const PACKAGE_NAME_ANDROID = 'com.example'

export const WIDTH = Dimensions.get('window').width
export const HEIGHT = Dimensions.get('window').height

export const OS = Platform.OS
export const ANDROID_VERSION = Platform.Version as number

export const INPUT_HEIGHT = 46

export const AVATAR_SIZE = 168.5

export const DEVICE_BOX_DIMENSIONS = 93

export const INVITATION_INPUT_MAX_CHARS_LENGTH = 200

export const SOCIAL_TYPES = ['apple', 'google', 'facebook']

export const PASSWORD_VALIDATION_KEYS: Array<keyof IPasswordValidationKeys> = [
  'hasMinLength',
  'hasNumberOrSymbol',
  'hasUpperAndLowerCase',
]

export const DEFAULT_RINGTONE =
  OS === 'ios'
    ? 'intercom.aiff'
    : `android.resource://${PACKAGE_NAME_ANDROID}/raw/intercom`

export const SOUND_RESOURCES_IOS: INotificationSound[] = [
  {
    title: 'Calm',
    soundID: 'calm',
    url: 'calm.aiff',
  },
  {
    title: 'Intercom',
    soundID: 'intercom',
    url: 'intercom.aiff',
  },
  {
    title: 'Magical',
    soundID: 'magical',
    url: 'magical.aiff',
  },
  {
    title: 'Pulse',
    soundID: 'pulse',
    url: 'pulse.aiff',
  },
  {
    title: 'Univers',
    soundID: 'univers',
    url: 'univers.aiff',
  },
]
