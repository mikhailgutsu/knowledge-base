import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useAxiosRequest } from '@api/hooks'
import { useTranslation } from 'react-i18next'
import { validatePassword } from '@helpers/index'
import { getStorageItem, removeStorageItem } from '@storage'

import {
  Box,
  Text,
  Input,
  Button,
  Screen,
  Loader,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import env from '@env'
import { USER_UPDATE_PASSWORD_ENDPOINT } from '@endpoints'

import type { LoggedOutStackScreenProps } from '@navigation/stacks/logged-out/logged-out.types'

type PasswordValidation = {
  hasMinLength: boolean
  hasNumberOrSymbol: boolean
  hasUpperAndLowerCase: boolean
}

const ResetPasswordScreen: React.FC<LoggedOutStackScreenProps<'ResetPassword'>> = (
  props
) => {
  const { navigation } = props

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [callUserUpdatePassword, { loading: loadingUserUpdatePassword }] =
    useAxiosRequest(USER_UPDATE_PASSWORD_ENDPOINT, 'post')

  const [password, setPassword] = React.useState({ value: '', error: '' })
  const [confirmPassword, setConfirmPassword] = React.useState({ value: '', error: '' })

  const passwordValidation = validatePassword({
    password: password.value,
    passwordCannotBeEmpty: t('resetPassword.password_cannot_be_empty'),
  })

  const confirmPasswordError = validatePassword({
    password: confirmPassword.value,
    passwordCannotBeEmpty: t('resetPassword.confirm_password_cannot_be_empty'),
  })

  const handleChangePassword = React.useCallback(async () => {
    if (typeof passwordValidation === 'string') {
      setPassword({ ...password, error: passwordValidation })
    } else {
      const hasValidationErrors = Object.values(passwordValidation).includes(false)

      setPassword({
        ...password,
        error: hasValidationErrors ? t('resetPassword.password_validation') : '',
      })
    }

    if (typeof confirmPasswordError === 'string') {
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError })
      return
    }

    if (password.value === confirmPassword.value) {
      const temporaryToken = await getStorageItem<string>(env.TEMPORARY_TOKEN)

      if (!!temporaryToken) {
        await callUserUpdatePassword(
          { password: confirmPassword.value },
          async (response) => {
            if (response.status === 200) {
              await removeStorageItem(env.TEMPORARY_TOKEN)

              return navigation.navigate('Login')
            }
          },
          {
            headers: {
              Authorization: `Bearer ${temporaryToken}`,
            },
          }
        )
      }
    }
  }, [password, confirmPassword])

  const getPasswordValidationMessage = (key: keyof PasswordValidation) => {
    const messages: Record<keyof PasswordValidation, string> = {
      hasMinLength: t('register.least_8_characters'),
      hasNumberOrSymbol: t('register.least_one_number_and_symbol'),
      hasUpperAndLowerCase: t('register.lowercase_uppercase_letters'),
    }
    return messages[key]
  }

  const validationKeys: Array<keyof PasswordValidation> = [
    'hasMinLength',
    'hasNumberOrSymbol',
    'hasUpperAndLowerCase',
  ]

  const validCount = Object.values(passwordValidation).filter(Boolean).length

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
        <Box mx="md">
          <Text variant="font24Bold" textAlign="center" color="secondary" py="lg">
            {t('resetPassword.reset_password')}
          </Text>

          <Input
            secureTextEntry
            autoCorrect={false}
            returnKeyType="next"
            autoCapitalize="none"
            value={password.value}
            placeholder={t('resetPassword.new_password')}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
          />
          {password.error && (
            <Text color="error" variant="font13SemiBold">
              {password.error}
            </Text>
          )}

          <Box mb="md">
            <Box mb="sm" bg="slate" height={2} mt="xs">
              <Box
                height={2}
                bg={
                  validCount === 1
                    ? 'error'
                    : validCount === 2
                    ? 'gold'
                    : validCount === 3
                    ? 'succes'
                    : 'transparent'
                }
                width={
                  validCount === 1
                    ? 54
                    : validCount === 2
                    ? 241
                    : validCount === 0
                    ? 0
                    : '100%'
                }
              />
            </Box>

            {validationKeys.map((key, index) => (
              <Box flexDirection="row" alignItems="center" key={index} mb="xs">
                {typeof passwordValidation === 'object' && passwordValidation[key] ? (
                  <ThemeIcon width={13} height={9} icon="ValidIcon" color="succes" />
                ) : (
                  <ThemeIcon icon="PointIcon" color="silverstone_to_steel" />
                )}

                <Text
                  ml="xs"
                  variant="font14Medium"
                  color={
                    typeof passwordValidation === 'object' && passwordValidation[key]
                      ? 'succes'
                      : 'silverstone_to_steel'
                  }
                >
                  {getPasswordValidationMessage(key)}
                </Text>
              </Box>
            ))}
          </Box>

          <Input
            secureTextEntry
            autoCorrect={false}
            returnKeyType="next"
            autoCapitalize="none"
            value={confirmPassword.value}
            placeholder={t('resetPassword.confirm_password')}
            onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
          />
          {(confirmPassword.error || password.value !== confirmPassword.value) && (
            <Text variant="font13SemiBold" color="error">
              {confirmPassword.error
                ? confirmPassword.error
                : t('editProfile.password_must_match')}
            </Text>
          )}
        </Box>

        <Button
          mx="md"
          mt="xs"
          height={48}
          bg="cerulean"
          alignItems="center"
          justifyContent="center"
          onPress={handleChangePassword}
          disabled={loadingUserUpdatePassword}
        >
          <Loader loading={loadingUserUpdatePassword} />

          <Text variant="font16Regular" color="white">
            {t('actions.change')}
          </Text>
        </Button>
      </ScrollView>
    </Screen>
  )
}

export default ResetPasswordScreen
