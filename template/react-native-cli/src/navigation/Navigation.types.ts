import type { NavigatorScreenParams } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { LoggedInStackParamList } from './stacks/logged-in/logged-in.types'
import type { LoggedOutStackParamList } from './stacks/logged-out/logged-out.types'

export enum CORE_STACK {
  LoggedInStack = 'LoggedInStack',
  LoggedOutStack = 'LoggedOutStack',
}

type RootStackParamList = {
  LoggedInStack: NavigatorScreenParams<LoggedInStackParamList>
  LoggedOutStack: NavigatorScreenParams<LoggedOutStackParamList>
}

type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type { RootStackParamList, RootStackScreenProps }
