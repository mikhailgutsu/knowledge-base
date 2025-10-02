import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useAxiosRequest } from '@api/hooks'
import { useTranslation } from 'react-i18next'
import { getStorageItem, setStorageItem } from '@storage'
import { useToast } from 'react-native-toast-notifications'

import {
  Box,
  Text,
  Button,
  Screen,
  Loader,
  ThemeIcon,
  ScrollView,
  OneTimePassword,
} from '@components/atoms'

import {
  USER_FORGOT_PASSWORD_EMAIL_SEND_ENDPOINT,
  USER_FORGOT_PASSWORD_EMAIL_CONFIRM_ENDPOINT,
} from '@endpoints'
import env from '@env'

import type { LoggedOutStackScreenProps } from '@navigation/stacks/logged-out/logged-out.types'

const ResetCodeScreen: React.FC<LoggedOutStackScreenProps<'ResetCode'>> = (props) => {
  const { navigation, route } = props

  const email = route.params.email

  const toast = useToast()

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [callUserForgotPasswordEmailSend, { loading: loadingUserForgotPinEmailSend }] =
    useAxiosRequest<{ token: string }>(USER_FORGOT_PASSWORD_EMAIL_SEND_ENDPOINT, 'get')

  const [
    callUserForgotPasswordCodeConfirm,
    { loading: loadingUserForgotPasswordCodeConfirm },
  ] = useAxiosRequest<{ token: string }>(
    USER_FORGOT_PASSWORD_EMAIL_CONFIRM_ENDPOINT,
    'post'
  )

  const [pin, setPin] = React.useState<string>('')
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    if (pin.length === 4) {
      return setIsCorrect(true)
    }
  }, [pin])

  const handleResendCode = async () => {
    if (!!email) {
      await callUserForgotPasswordEmailSend(
        undefined,
        async (response) => {
          if (response.status === 200) {
            await setStorageItem(env.TEMPORARY_TOKEN, response.data.token)

            toast.show(t('pinResetViaOTP.pin_successful_resend'), { type: 'success' })

            return setPin('')
          }
        },
        {
          additionalUrl: `?email=${email}`,
        }
      )
    }
  }

  const handleSubmitCode = async (): Promise<void> => {
    const temporaryToken = await getStorageItem<string>(env.TEMPORARY_TOKEN)

    if (!!temporaryToken) {
      await callUserForgotPasswordCodeConfirm(
        { code: pin },
        async (response) => {
          if (response.status === 200) {
            await setStorageItem<string>(env.TEMPORARY_TOKEN, response.data.token)

            return navigation.navigate('ResetPassword')
          }
        },
        {
          headers: { Authorization: `Bearer ${temporaryToken}` },
        }
      ).then((response) => {
        if (response?.status !== 200) {
          setIsCorrect(false)
        }
      })
    }
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <Box
        height={56}
        alignItems="center"
        flexDirection="row"
        bg="ivory_to_charcoal"
        justifyContent="center"
      >
        <Button
          left={10}
          width={30}
          height={56}
          position="absolute"
          alignItems="center"
          justifyContent="center"
          onPress={navigation.goBack}
        >
          <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
        </Button>

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />
      </Box>

      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <Box flex={1} px="md" my="md" justifyContent="space-between">
          <Box>
            <Text variant="font28Bold" color="secondary" textAlign="center">
              {t('resetPassword.verify_email')}
            </Text>

            <Box mt="sm" borderWidth={1} borderColor="succes" py="extraSmall" px="md">
              <Text variant="font14SemiBold" textAlign="center" color="succes">
                {t('resetPassword.check_email_account_for_the_code')}
              </Text>
            </Box>

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
                  {t('resetPassword.receive_confirm_code')}
                </Text>

                <Button
                  mt="sm"
                  height={48}
                  borderWidth={1}
                  alignItems="center"
                  bg="charcoal_to_ivory"
                  justifyContent="center"
                  onPress={handleResendCode}
                  borderColor="ivory_to_steel"
                  disabled={loadingUserForgotPinEmailSend}
                >
                  <Loader loading={loadingUserForgotPinEmailSend} />

                  <Text variant="font16Regular" color="ivory_to_steel">
                    {t('actions.resend_code')}
                  </Text>
                </Button>
              </React.Fragment>
            )}

            <Button
              mt="sm"
              height={48}
              bg="cerulean"
              alignItems="center"
              justifyContent="center"
              onPress={handleSubmitCode}
              disabled={loadingUserForgotPasswordCodeConfirm}
            >
              <Loader loading={loadingUserForgotPasswordCodeConfirm} />

              <Text variant="font16Regular" color="white">
                {t('actions.submit')}
              </Text>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default ResetCodeScreen
