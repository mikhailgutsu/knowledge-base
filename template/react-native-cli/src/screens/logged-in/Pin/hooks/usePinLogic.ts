import React from 'react'
import { t } from 'i18next'

import { Toast } from 'react-native-toast-notifications'
import { useNavigation } from '@react-navigation/native'
import { getStorageItem, setStorageItem } from '@storage'

import type { LoggedInHomeStackParamList } from '@navigation/stacks/logged-in/logged-in.types'

interface IUsePinLogicProps {
  isNewPin: boolean
}

const usePinLogic = (props: IUsePinLogicProps) => {
  const { isNewPin } = props

  const homeNavigation = useNavigation<LoggedInHomeStackParamList['navigation']>()

  const [pin, setPin] = React.useState<string>('')
  const [pendingPin, setPendingPin] = React.useState<string | null>(null)

  const [isCreating, setIsCreating] = React.useState<boolean>(!isNewPin)

  React.useEffect(() => {
    if (pin.length !== 4 || isNewPin) return

    const validateStoredPin = async () => {
      try {
        const storedPin = await getStorageItem<string>('PIN')
        if (!storedPin) return

        if (storedPin !== pin) {
          Toast.show(t('pin.pin_incorrect'), { type: 'danger', duration: 1500 })
          return setPin('')
        }

        return homeNavigation.navigate('HOME', { screen: 'WelcomeBack' })
      } catch (error) {
        console.error('Warning loading PIN from storage:', error)
      }
    }

    validateStoredPin()
  }, [pin, isNewPin])

  const handleCreateNewPin = React.useCallback(() => {
    if (pin.length !== 4) {
      Toast.show(t('pin.pin_enter_4_digit'), { type: 'danger' })
      return setPin('')
    }

    setIsCreating(true)
    setPendingPin(pin)
    setPin('')
  }, [pin])

  const handleConfirmPinsMatch = React.useCallback(async () => {
    if (pendingPin !== pin) {
      Toast.show(t('pin.pin_do_not_match'), { type: 'danger' })
      return setPin('')
    }

    setPin('')
    void setStorageItem('PIN', pin)

    homeNavigation.navigate('HOME', { screen: 'PinSuccessfullyChanged' })
  }, [pendingPin, pin])

  const handleNumberButtonPress = React.useCallback((value: string) => {
    setPin((prev) => (prev.length < 4 ? prev + value : prev))
  }, [])

  const handleRemoveLastPinNumber = React.useCallback(() => {
    setPin((prev) => prev.slice(0, -1))
  }, [])

  const handleClearPin = React.useCallback(() => {
    setPin('')
  }, [])

  const handleNavigateToPinResetViaEmail = () => {
    homeNavigation.navigate('HOME', { screen: 'PinResetViaEmail' })
  }

  return {
    pin,
    isCreating,
    handleClearPin,
    handleCreateNewPin,
    handleConfirmPinsMatch,
    isConfirming: !isNewPin,
    handleNumberButtonPress,
    handleRemoveLastPinNumber,
    handleNavigateToPinResetViaEmail,
  }
}

export default usePinLogic
