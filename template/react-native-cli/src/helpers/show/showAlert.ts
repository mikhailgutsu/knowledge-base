import { Alert, Appearance, type AlertButton } from 'react-native'

import { getStorageItem } from '@storage'

import { OS } from 'src/constants'

import type { ThemeType } from '@theme/index'

interface IShowAlert {
  title: string
  message: string
  cancelText?: string
  cancelable?: boolean
  onPressText?: string
  onPress?: () => void
  onDismiss?: () => void
  userInterfaceStyle?: 'unspecified' | 'light' | 'dark'
}

export const showAlert = async (showAlertProps: IShowAlert) => {
  const {
    title,
    message,
    cancelText,
    cancelable = false,
    userInterfaceStyle,
    onPressText = 'OK',
    onPress = () => null,
    onDismiss = () => null,
  } = showAlertProps

  const storedTheme = await getStorageItem<ThemeType>('themeMode')

  const buttons: AlertButton[] = [
    ...(cancelText ? [{ text: cancelText, style: 'cancel' } as AlertButton] : []),
    { text: onPressText, onPress },
  ]

  return Alert.alert(title, message, buttons, {
    onDismiss,
    cancelable: OS === 'ios' || cancelable,
    userInterfaceStyle:
      userInterfaceStyle ?? storedTheme ?? Appearance.getColorScheme() ?? 'dark',
  })
}
