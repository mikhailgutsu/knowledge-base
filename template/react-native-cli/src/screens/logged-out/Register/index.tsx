import React from 'react'
import {
  type MediaType,
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker'
import { ActivityIndicator, type KeyboardTypeOptions } from 'react-native'

import { useTheme } from '@theme/useTheme'
import { useAxiosRequest } from '@api/hooks'
import { useTranslation } from 'react-i18next'
import { useToast } from 'react-native-toast-notifications'
import { validateEmail, validateName, validatePassword } from '@helpers/index'

import {
  Box,
  Text,
  Image,
  Input,
  Button,
  Screen,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import { AVATAR_SIZE } from 'src/constants'
import { AUTH_SIGNUP_ENDPOINT } from '@endpoints'

import type { LoggedOutStackScreenProps } from '@navigation/stacks/logged-out/logged-out.types'

const keyboardTypes: Record<string, KeyboardTypeOptions> = {
  default: 'default',
  'phone-pad': 'phone-pad',
  'email-address': 'email-address',
}

type PasswordValidation = {
  hasMinLength: boolean
  hasNumberOrSymbol: boolean
  hasUpperAndLowerCase: boolean
}

const RegisterScreen: React.FC<LoggedOutStackScreenProps<'Register'>> = (props) => {
  const { navigation } = props

  const toast = useToast()

  const { t } = useTranslation()

  const [callSignup, { loading }] = useAxiosRequest(AUTH_SIGNUP_ENDPOINT, 'post')

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [avatar, setAvatar] = React.useState('')

  const [formData, setFormData] = React.useState({
    email: { value: '', error: '' },
    fullName: { value: '', error: '' },
    password: { value: '', error: '' },
    confirmPassword: { value: '', error: '' },
  })

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

  const INPUT_FIELDS = [
    {
      name: 'fullName',
      placeholder: t('register.full_name'),
      value: formData.fullName.value,
      keyboardType: keyboardTypes.default,
    },
    {
      name: 'email',
      placeholder: t('register.email'),
      value: formData.email.value,
      keyboardType: keyboardTypes['email-address'],
    },
    {
      secure: true,
      name: 'password',
      value: formData.password.value,
      placeholder: t('register.password'),
      keyboardType: keyboardTypes.default,
    },
    {
      secure: true,
      name: 'confirmPassword',
      keyboardType: keyboardTypes.default,
      value: formData.confirmPassword.value,
      placeholder: t('register.confirm_password'),
    },
  ]

  const handleChange = (name: keyof typeof formData, value: string) => {
    const fieldsToValidate: (keyof typeof formData)[] = [
      'email',
      'fullName',
      'password',
      'confirmPassword',
    ]

    setFormData((prev) => ({
      ...prev,
      [name]: fieldsToValidate.includes(name)
        ? {
            value,
            error: '',
          }
        : value,
    }))
  }

  const passwordValidation = validatePassword({
    password: formData.password.value,
    passwordCannotBeEmpty: t('resetPassword.password_cannot_be_empty'),
  })

  const confirmPasswordValidation = validatePassword({
    password: formData.confirmPassword.value,
    passwordCannotBeEmpty: t('resetPassword.confirm_password_cannot_be_empty'),
  })

  const onCreateAccount = React.useCallback(async () => {
    const emailValidation = validateEmail({
      email: formData.email.value,
      validEmail: t('register.email_is_not_valid'),
      emailCannotBeEmpty: t('register.email_cant_be_empty'),
    })

    const fullNameValidation = validateName({
      name: formData.fullName.value,
      nameCannotBeEmpty: t('register.name_cant_be_empty'),
    })

    const updatedFormData = { ...formData }

    let isValid = true

    if (fullNameValidation) {
      updatedFormData.fullName.error = fullNameValidation
      isValid = false
    }

    if (emailValidation) {
      updatedFormData.email.error = emailValidation
      isValid = false
    }

    if (typeof passwordValidation === 'string') {
      updatedFormData.password.error = passwordValidation
      isValid = false
    } else {
      const hasValidationErrors = Object.values(passwordValidation).includes(false)
      if (hasValidationErrors) {
        updatedFormData.password.error = t('resetPassword.password_validation')
        isValid = false
      }
    }

    if (typeof confirmPasswordValidation === 'string') {
      updatedFormData.confirmPassword.error = confirmPasswordValidation
      isValid = false
    }

    if (formData.password.value !== formData.confirmPassword.value) {
      updatedFormData.confirmPassword.error = t('editProfile.password_must_match')
      isValid = false
    }

    if (!isValid) {
      setFormData(updatedFormData)
      return
    }

    try {
      const payload = {
        email: formData.email.value,
        password: formData.password.value,
        fullName: formData.fullName.value,
      }

      return await callSignup(payload, async (signupResponse) => {
        if (signupResponse.status === 201) {
          navigation.navigate('Login')

          return toast.show(t('register.success_register'), { type: 'success' })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }, [formData])

  const validCount = Object.values(passwordValidation).filter(Boolean).length

  const renderErrorText = (name: string, formData: any, t: (key: string) => string) => {
    const error =
      name === 'confirmPassword'
        ? formData.confirmPassword.error ||
          (formData.password.value !== formData.confirmPassword.value &&
            t('editProfile.password_must_match'))
        : formData[name]?.error

    return (
      error && (
        <Text variant="font13SemiBold" color="error">
          {error}
        </Text>
      )
    )
  }

  const openGallery = () => {
    const options: ImageLibraryOptions = {
      quality: 1,
      mediaType: 'photo' as MediaType,
    }

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('The user has deselected the image')
      }

      if (response.errorMessage) {
        console.error('Error:', response.errorMessage)
      }

      if (response.assets && response.assets.length > 0) {
        setAvatar(response.assets[0].uri ?? '')
      }
    })
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusBarStyle={statusBarStyle}
      statusColor="white_to_charcoal"
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

      <ScrollView automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
        <Box my="md">
          <Text variant="font24Bold" textAlign="center" color="secondary">
            {t('actions.create_account')}
          </Text>

          <Text variant="font14Medium" textAlign="center" color="silverstone_to_steel">
            {t('register.sign_up_to_start')}
          </Text>
        </Box>

        <Box mt="xl" mb="sm" alignItems="center">
          <ThemeIcon
            bottom={-40}
            position="absolute"
            fill="charcoal_to_ivory"
            color="silver_to_steel"
            icon="LogoDecorativeCircleIcon"
          />
          <Box
            mt="lg"
            bg="cerulean"
            alignItems="center"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            justifyContent="center"
            borderRadius={AVATAR_SIZE}
          >
            {avatar ? (
              <Image
                resizeMode="cover"
                source={{ uri: avatar }}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE,
                }}
              />
            ) : (
              <ThemeIcon icon="UserIcon" width={129} height={129} strokeWidth={1} />
            )}
          </Box>

          <Button
            bg="slate"
            zIndex={1}
            width={49}
            bottom={20}
            height={49}
            borderRadius={49}
            alignItems="center"
            onPress={openGallery}
            justifyContent="center"
          >
            <ThemeIcon icon="PhotoIcon" />
          </Button>
        </Box>

        {INPUT_FIELDS.map((inputFieldsProps) => {
          const { placeholder, value, keyboardType, name, secure } = inputFieldsProps

          return (
            <Box key={name} px="md" mt="sm">
              <Box>
                <Text
                  mb="xs"
                  variant="font16Regular"
                  color="slate_to_charcoal"
                  textTransform="uppercase"
                >
                  {placeholder}
                </Text>

                <Input
                  value={value}
                  autoCorrect={false}
                  returnKeyType="next"
                  autoCapitalize="none"
                  secureTextEntry={secure}
                  placeholder={placeholder}
                  keyboardType={keyboardType}
                  onChangeText={(text) =>
                    handleChange(name as keyof typeof formData, text)
                  }
                />
                {renderErrorText(name, formData, t)}
              </Box>

              {name === 'password' && (
                <React.Fragment>
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
                    <Box flexDirection="row" alignItems="center" key={index}>
                      {typeof passwordValidation === 'object' &&
                      passwordValidation[key] ? (
                        <ThemeIcon
                          width={13}
                          height={9}
                          icon="ValidIcon"
                          color="succes"
                        />
                      ) : (
                        <ThemeIcon icon="PointIcon" color="ivory_to_charcoal" />
                      )}

                      <Text
                        variant="font14Medium"
                        color={
                          typeof passwordValidation === 'object' &&
                          passwordValidation[key]
                            ? 'succes'
                            : 'ivory_to_charcoal'
                        }
                        ml="xs"
                      >
                        {getPasswordValidationMessage(key)}
                      </Text>
                    </Box>
                  ))}
                </React.Fragment>
              )}
            </Box>
          )
        })}

        <Button
          mt="sm"
          mx="md"
          mb="lg"
          height={48}
          bg="cerulean"
          disabled={loading}
          alignItems="center"
          justifyContent="center"
          onPress={onCreateAccount}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text variant="font16Bold" color="white">
              {t('actions.create_account')}
            </Text>
          )}
        </Button>
      </ScrollView>
    </Screen>
  )
}

export default RegisterScreen
