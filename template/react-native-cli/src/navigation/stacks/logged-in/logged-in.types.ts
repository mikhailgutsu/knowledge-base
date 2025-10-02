import type { Device, IDevice } from '@typings/user'
import type { DrawerScreenProps } from '@react-navigation/drawer'
import type { NavigatorScreenParams } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type LoggedInHomeStackParamList = DrawerScreenProps<
  LoggedInDrawerParamList,
  (typeof LOGGED_IN_SCREENS)['HOME']
>

export type LoggedInStackScreenProps<T extends keyof LoggedInStackParamList> =
  NativeStackScreenProps<LoggedInStackParamList, T>

export type LoggedInDrawerScreenProps<T extends keyof LoggedInDrawerParamList> =
  DrawerScreenProps<LoggedInDrawerParamList, T>
