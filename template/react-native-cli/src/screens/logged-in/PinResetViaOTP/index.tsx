import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useAxiosRequest } from '@api/hooks'
import { useTranslation } from 'react-i18next'
import { useToast } from 'react-native-toast-notifications'
import { getStorageItem, removeStorageItem, setStorageItem } from '@storage'

import * as PIN_RESET_VIA_OTP_PARTS from './parts'
import { Box, Text, Screen, ScrollView, OneTimePassword } from '@components/atoms'

import env from '@env'
import {
  USER_PIN_CODE_EMAIL_SEND_ENDPOINT,
  USER_FORGOT_PIN_CODE_CONFIRM_ENDPOINT,
} from '@endpoints'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const PinResetViaOTPScreen: React.FC<LoggedInStackScreenProps<'PinResetViaOTP'>> = (
  props
) => {
  const { navigation } = props

  const toast = useToast()

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [callForgotPinEmailSend, { loading: loadingForgotPinEmailSend }] =
    useAxiosRequest(USER_PIN_CODE_EMAIL_SEND_ENDPOINT, 'get')

  const [
    callForgotPinCodeConfirm,
    { loading: loadingForgotPinCodeConfirm, error: errorForgotPinCodeConfirm },
  ] = useAxiosRequest(USER_FORGOT_PIN_CODE_CONFIRM_ENDPOINT, 'post')

  const [pin, setPin] = React.useState<string>('')
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    if (pin.length === 4) {
      return setIsCorrect(true)
    }
  }, [pin])

  const handleResendCode = async (): Promise<void> => {
    const userToken = await getStorageItem(env.USER_TOKEN)

    await callForgotPinEmailSend(
      undefined,
      async (response) => {
        if (response.status === 200) {
          await setStorageItem(env.TEMPORARY_TOKEN, response.data.token)

          toast.show(t('pinResetViaOTP.pin_successful_resend'), { type: 'success' })

          return setPin('')
        }
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
  }

  const handleSubmitCode = async (): Promise<void> => {
    const temporaryToken = await getStorageItem(env.TEMPORARY_TOKEN)

    await callForgotPinCodeConfirm(
      { code: pin },
      async (response) => {
        if (response.status === 200) {
          await removeStorageItem(env.TEMPORARY_TOKEN)

          return navigation.navigate('Pin', { isNewPin: true })
        }
      },
      {
        headers: {
          Authorization: `Bearer ${temporaryToken}`,
        },
      }
    ).then((response) => {
      if (response?.status !== 200) {
        setIsCorrect(false)
      }
    })
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <PIN_RESET_VIA_OTP_PARTS.PinResetHeader navigation={navigation} />

      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <Box flex={1} px="md" my="md" justifyContent="space-between">
          <Box>
            <PIN_RESET_VIA_OTP_PARTS.PinResetTitle />

            <PIN_RESET_VIA_OTP_PARTS.PinResetSubtitle />

            <OneTimePassword
              my="md"
              value={pin}
              setValue={setPin}
              alignItems="center"
              flexDirection="row"
              isCorrect={isCorrect}
              justifyContent="center"
              setIsCorrect={setIsCorrect}
            />
          </Box>

          <Box mt="md">
            {!isCorrect && (
              <React.Fragment>
                <Text
                  mt="sm"
                  color="secondary"
                  textAlign="center"
                  variant="font14SemiBold"
                >
                  {t('pinResetViaOTP.pin_receive_confirm')}
                </Text>

                <PIN_RESET_VIA_OTP_PARTS.PinResetResendCodeButton
                  loading={loadingForgotPinEmailSend}
                  handleResendCode={handleResendCode}
                />
              </React.Fragment>
            )}

            <PIN_RESET_VIA_OTP_PARTS.PinResetSubmitButton
              handleSubmitCode={handleSubmitCode}
              loading={loadingForgotPinCodeConfirm}
            />
          </Box>
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default PinResetViaOTPScreen
