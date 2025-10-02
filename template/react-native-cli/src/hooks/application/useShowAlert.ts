import { Alert, type AlertOptions, type AlertButton } from 'react-native'

import { useTheme } from '@theme/useTheme'

import { OS } from 'src/constants'

interface IShowAlert {
  title: string
  message: string
  cancelText?: string
  cancelable?: boolean
  onPressText?: string
  onPress?: () => void
  onDismiss?: () => void
}

const useShowAlert = () => {
  const { isDarkTheme } = useTheme()

  return ({
    title,
    message,
    cancelText,
    cancelable = false,
    onPressText = 'OK',
    onPress = () => null,
    onDismiss = () => null,
  }: IShowAlert) => {
    const buttons: AlertButton[] = [
      ...(cancelText ? [{ text: cancelText, style: 'cancel' } as AlertButton] : []),

      { text: onPressText, onPress },
    ]

    const options: AlertOptions = {
      onDismiss,
      cancelable: OS === 'ios' || cancelable,
      userInterfaceStyle: isDarkTheme ? 'dark' : 'light',
    }

    return Alert.alert(title, message, buttons, options)
  }
}

export default useShowAlert
