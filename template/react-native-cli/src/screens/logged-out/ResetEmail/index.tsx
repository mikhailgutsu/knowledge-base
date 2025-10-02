import React from 'react'

import { setStorageItem } from '@storage'
import { useTheme } from '@theme/useTheme'
import { useAxiosRequest } from '@api/hooks'
import { useTranslation } from 'react-i18next'
import { validateEmail } from '@helpers/index'

import {
  Box,
  Text,
  Input,
  Screen,
  Button,
  Loader,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import env from '@env'
import { USER_FORGOT_PASSWORD_EMAIL_SEND_ENDPOINT } from '@endpoints'

import type { LoggedOutStackScreenProps } from '@navigation/stacks/logged-out/logged-out.types'

const ResetEmailScreen: React.FC<LoggedOutStackScreenProps<'ResetEmail'>> = (props) => {
  const { navigation } = props

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [email, setEmail] = React.useState({ value: '', error: '' })

  const [
    callUserForgotPasswordEmailSend,
    { loading: loadingUserForgotPasswordEmailSend },
  ] = useAxiosRequest<{ token: string }>(USER_FORGOT_PASSWORD_EMAIL_SEND_ENDPOINT, 'get')

  const handleSendCode = async () => {
    const emailValidation = validateEmail({
      email: email.value,
      validEmail: t('register.email_is_not_valid'),
      emailCannotBeEmpty: t('register.email_cant_be_empty'),
    })

    if (emailValidation) {
      setEmail({ ...email, error: emailValidation })
      return
    }

    await callUserForgotPasswordEmailSend(
      undefined,
      async (response) => {
        if (response.status === 200) {
          await setStorageItem(env.TEMPORARY_TOKEN, response.data.token)

          return navigation.navigate('ResetCode', { email: email.value })
        }
      },
      {
        additionalUrl: `?email=${email.value}`,
      }
    )
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
        mb="md"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <Box flex={1} paddingHorizontal="md" justifyContent="space-between">
          <Box my="xl">
            <Text variant="font28Bold" color="secondary" textAlign="center" mb="xs">
              {t('resetPassword.reset_your_password')}
            </Text>

            <Text
              mb="xl"
              textAlign="center"
              variant="font14SemiBold"
              color="silverstone_to_steel"
            >
              {t('resetPassword.enter_email_to_receive_code')}
            </Text>

            <Input
              value={email.value}
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder={t('resetPassword.email')}
              onChangeText={(value) => setEmail({ value, error: '' })}
            />
            {email.error && (
              <Text color="error" variant="font13SemiBold">
                {email.error}
              </Text>
            )}
          </Box>

          <Button
            height={48}
            bg="cerulean"
            alignItems="center"
            justifyContent="center"
            onPress={handleSendCode}
            disabled={loadingUserForgotPasswordEmailSend}
          >
            <Loader loading={loadingUserForgotPasswordEmailSend} />

            <Text variant="font16SemiBold" color="white">
              {t('actions.send_verification_code')}
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default ResetEmailScreen
