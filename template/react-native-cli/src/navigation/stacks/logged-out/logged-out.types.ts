import type { NativeStackScreenProps } from '@react-navigation/native-stack'



export type LoggedOutStackScreenProps<T extends keyof LoggedOutStackParamList> =
  NativeStackScreenProps<LoggedOutStackParamList, T>
