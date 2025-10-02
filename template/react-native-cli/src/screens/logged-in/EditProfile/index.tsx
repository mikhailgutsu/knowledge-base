import React from 'react'
import { t } from 'i18next'
import {
  type MediaType,
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker'
import { type KeyboardTypeOptions } from 'react-native'
import { Toast } from 'react-native-toast-notifications'

import {
  useShowAlert,
  useCurrentUser,
  useCurrentUserUpdate,
  useCurrentUserDelete,
} from '@hooks'
import { useDispatch } from 'react-redux'
import { useTheme } from '@theme/useTheme'
import { useFocusEffect } from '@react-navigation/native'
import { getStorageItem, setStorageItem } from '@storage'
import { saveGalleryState } from '@store/galleryOpen/galleryOpen.actions'
import { validateEmail, validateName, validatePassword } from '@helpers/index'

import {
  Box,
  Text,
  Image,
  Input,
  Screen,
  Button,
  Loader,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import { AVATAR_SIZE, PASSWORD_VALIDATION_KEYS, SOCIAL_TYPES } from 'src/constants'

import type { SocialType } from '@typings/social'
import type { ICurrentUserResponse } from '@typings/user'
import type { IPasswordValidationKeys } from '@typings/password'
import type { LoggedInDrawerScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const EditProfileScreen: React.FC<LoggedInDrawerScreenProps<'EDIT PROFILE'>> = (
  props
) => {
  const { navigation } = props

  const dispatch = useDispatch()

  const showAlert = useShowAlert()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const { currentUserData, currentUserAvatar, setCurrentUserData, setCurrentUserAvatar } =
    useCurrentUser()

  const { loadingCurrentUserUpdateData, fetchCurrentUserUpdateData } =
    useCurrentUserUpdate()

  const { loadingCurrentUserDeleteData, fetchCurrentUserDeleteData } =
    useCurrentUserDelete()

  const [formData, setFormData] = React.useState({
    email: { value: '', error: '' },
    fullName: { value: '', error: '' },
    password: { value: '', error: '' },
    confirmPassword: { value: '', error: '' },
  })

  const [socialType, setSocialType] = React.useState<SocialType | ''>('')

  const [passwordValidation, setPasswordValidation] =
    React.useState<IPasswordValidationKeys>({
      hasMinLength: false,
      hasNumberOrSymbol: false,
      hasUpperAndLowerCase: false,
    })

  const validCount = Object.values(passwordValidation).filter(Boolean).length

  const INPUT_FIELDS = [
    {
      name: 'email',
      editable: false,
      value: formData.email.value,
      placeholder: t('editProfile.email'),
      keyboardType: 'email-address' as KeyboardTypeOptions,
    },
    {
      name: 'fullName',
      value: formData.fullName.value,
      placeholder: t('editProfile.full_name'),
      keyboardType: 'default' as KeyboardTypeOptions,
    },
    ...(!SOCIAL_TYPES?.includes(socialType)
      ? [
          {
            name: 'password',
            secureTextEntry: true,
            value: formData.password.value,
            placeholder: t('resetPassword.new_password'),
            keyboardType: 'default' as KeyboardTypeOptions,
          },
          {
            secureTextEntry: true,
            name: 'confirmPassword',
            value: formData.confirmPassword.value,
            keyboardType: 'default' as KeyboardTypeOptions,
            placeholder: t('resetPassword.confirm_password'),
          },
        ]
      : []),
  ]

  useFocusEffect(
    React.useCallback(() => {
      const getCurrentUserStorage = async () => {
        const type = (await getStorageItem<SocialType>('SOCIAL_TYPE')) ?? ''
        setSocialType(type)

        const currentUserStorage = await getStorageItem<ICurrentUserResponse>(
          'currentUser'
        )
        setCurrentUserData(currentUserStorage)

        const avatarStorage = await getStorageItem<string>(
          `avatar-${currentUserStorage?.email}`
        )
        setCurrentUserAvatar(avatarStorage)

        if (currentUserStorage) {
          setFormData((prevFormDataState) => ({
            ...prevFormDataState,
            email: { value: currentUserStorage.email, error: '' },
            fullName: { value: currentUserStorage.fullName, error: '' },
          }))
        } else {
          console.log('No user data found in storage.')
        }
      }

      getCurrentUserStorage()
    }, [])
  )

  const validateForm = () => {
    const fullNameError = validateName({
      name: formData.fullName.value,
      nameCannotBeEmpty: t('register.name_cant_be_empty'),
    })

    const emailError = validateEmail({
      email: formData.email.value,
      validEmail: t('register.email_is_not_valid'),
      emailCannotBeEmpty: t('register.email_cant_be_empty'),
    })

    const passwordValidationResult = validatePassword({
      password: formData.password.value,
      passwordCannotBeEmpty: t('resetPassword.password_cannot_be_empty'),
    })

    if (typeof passwordValidationResult !== 'string') {
      setPasswordValidation(passwordValidationResult)
    }

    const passwordError =
      typeof passwordValidationResult === 'string'
        ? passwordValidationResult
        : Object.entries(passwordValidation)
            .filter(([_, isValid]) => !isValid)
            .map(([key]) =>
              getPasswordValidationMessage(key as keyof IPasswordValidationKeys)
            )
            .join(', ')

    const confirmPasswordError =
      formData.password.value !== formData.confirmPassword.value
        ? t('editProfile.password_must_match')
        : ''

    setFormData((prev) => ({
      ...prev,
      email: { ...prev.email, error: emailError },
      fullName: { ...prev.fullName, error: fullNameError },
      password: { ...prev.password, error: passwordError },
      confirmPassword: { ...prev.confirmPassword, error: confirmPasswordError },
    }))

    return !fullNameError && !emailError && !passwordError && !confirmPasswordError
  }

  const getPasswordValidationMessage = (key: keyof IPasswordValidationKeys) => {
    const messages: Record<keyof IPasswordValidationKeys, string> = {
      hasMinLength: t('register.least_8_characters'),
      hasNumberOrSymbol: t('register.least_one_number_and_symbol'),
      hasUpperAndLowerCase: t('register.lowercase_uppercase_letters'),
    }
    return messages[key]
  }

  const handleEditStandardAccount = async () => {
    if (!validateForm()) return

    const currentUserStorage = await getStorageItem<ICurrentUserResponse>('currentUser')
    const { fullName, password, confirmPassword } = formData

    if (
      fullName.value &&
      currentUserStorage &&
      password.value === confirmPassword.value
    ) {
      await fetchCurrentUserUpdateData({
        fullName: fullName.value,
        password: password.value,
      }).then((response) => {
        if (response?.status === 200) {
          setFormData({
            ...formData,
            password: { value: '', error: '' },
            confirmPassword: { value: '', error: '' },
          })

          navigation.goBack()
        }
      })
    }
  }

  const handleEditSocialAccount = async () => {
    const currentUserStorage = await getStorageItem<ICurrentUserResponse>('currentUser')

    const { fullName } = formData

    if (currentUserStorage?.fullName === fullName.value) {
      Toast.show(t('editProfile.full_name_has_not_been_changed'), { type: 'warning' })
      return
    }

    const fullNameError = validateName({
      name: fullName.value,
      nameCannotBeEmpty: t('register.name_cant_be_empty'),
    })

    if (fullNameError) {
      setFormData((prev) => ({
        ...prev,
        fullName: { ...prev.fullName, error: fullNameError },
      }))

      return
    }

    await fetchCurrentUserUpdateData({ fullName: fullName.value }).then((response) => {
      if (response?.status === 200) {
        navigation.goBack()
      }
    })
  }

  const handleEditAccount = async () => {
    if (socialType) {
      handleEditSocialAccount()
    } else {
      handleEditStandardAccount()
    }
  }

  const handleDeleteAccount = async () => {
    showAlert({
      cancelable: true,
      cancelText: t('actions.cancel'),
      title: t('editProfile.show_alert_delete_account_title'),
      message: t('editProfile.show_alert_delete_account_message'),
      onPressText: t('editProfile.show_alert_delete_account_delete'),
      onPress: async () => {
        await fetchCurrentUserDeleteData({ email: currentUserData?.email! })
      },
    })
  }

  const handleOpenGallery = () => {
    dispatch(saveGalleryState({ state: true }))

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
        const avatar = response?.assets[0].uri ?? ''

        await setStorageItem<string>(`avatar-${currentUserData?.email}`, avatar)

        setCurrentUserAvatar(avatar)
      }
    })
  }

  const handleChangeInput = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: { value, error: '' },
    }))

    if (name === 'password') {
      const passwordValidationResult = validatePassword({
        password: value,
        passwordCannotBeEmpty: t('resetPassword.password_cannot_be_empty'),
      })

      if (typeof passwordValidationResult !== 'string') {
        setPasswordValidation(passwordValidationResult)
      } else {
        setPasswordValidation({
          hasMinLength: false,
          hasNumberOrSymbol: false,
          hasUpperAndLowerCase: false,
        })
      }
    }
  }

  const handleGoBack = () => {
    if (!SOCIAL_TYPES?.includes(socialType)) {
      setFormData({
        ...formData,
        password: { value: '', error: '' },
        confirmPassword: { value: '', error: '' },
      })
    }

    navigation.goBack()
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <Box height={56} alignItems="center" bg="ivory_to_charcoal" justifyContent="center">
        <Button
          left={10}
          width={30}
          height={56}
          position="absolute"
          alignItems="center"
          onPress={handleGoBack}
          justifyContent="center"
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
        <Text mt="lg" variant="font24Bold" textAlign="center" color="secondary">
          {t('editProfile.edit_profile')}
        </Text>

        <Box mt="xl" mb="sm" alignItems="center">
          <ThemeIcon
            bottom={-40}
            position="absolute"
            fill="charcoal_to_ivory"
            color="silver_to_steel"
            icon="LogoDecorativeCircleIcon"
          />
          <Box
            mt="xl"
            bg="cerulean"
            alignItems="center"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            justifyContent="center"
            borderRadius={AVATAR_SIZE}
          >
            {currentUserAvatar ? (
              <Image
                resizeMode="cover"
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE,
                }}
                source={{ uri: currentUserAvatar }}
              />
            ) : (
              <ThemeIcon icon="UserIcon" width={129} height={129} strokeWidth={1} />
            )}
          </Box>

          <Button
            width={49}
            zIndex={1}
            bottom={20}
            height={49}
            bg="silverstone"
            borderRadius={49}
            alignItems="center"
            justifyContent="center"
            onPress={handleOpenGallery}
          >
            <ThemeIcon icon="PhotoIcon" color="white" />
          </Button>
        </Box>

        <Box flex={1} justifyContent="space-between">
          <Box>
            {INPUT_FIELDS.map((inputFieldsProps) => {
              const {
                name,
                value,
                editable,
                placeholder,
                keyboardType,
                secureTextEntry,
              } = inputFieldsProps

              return (
                <Box key={name} px="md" mt="sm">
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
                    editable={editable}
                    returnKeyType="next"
                    autoCapitalize="none"
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoComplete={name === 'email' ? 'email' : 'off'}
                    onChangeText={(text) =>
                      handleChangeInput(name as keyof typeof formData, text)
                    }
                  />

                  <Text color="error" variant="font13SemiBold">
                    {formData[name as keyof typeof formData].error}
                  </Text>

                  {name === 'password' && formData.password.value && (
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
                              ? '33%'
                              : validCount === 2
                              ? '66%'
                              : validCount === 3
                              ? '100%'
                              : '0%'
                          }
                        />
                      </Box>

                      {PASSWORD_VALIDATION_KEYS.map((key, index) => (
                        <Box flexDirection="row" alignItems="center" key={index} mb="xs">
                          {passwordValidation[key] ? (
                            <ThemeIcon
                              width={13}
                              height={9}
                              color="succes"
                              icon="ValidIcon"
                            />
                          ) : (
                            <ThemeIcon icon="PointIcon" color="ivory_to_charcoal" />
                          )}

                          <Text
                            ml="xs"
                            variant="font14Medium"
                            color={
                              passwordValidation[key] ? 'succes' : 'ivory_to_charcoal'
                            }
                          >
                            {getPasswordValidationMessage(key)}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          <Box>
            <Button
              mt="sm"
              mx="md"
              height={48}
              borderWidth={1}
              alignItems="center"
              borderColor="error"
              justifyContent="center"
              onPress={handleDeleteAccount}
              disabled={loadingCurrentUserDeleteData}
              bg={statusBarStyle === 'light-content' ? 'red' : 'transparent'}
            >
              <Loader loading={loadingCurrentUserDeleteData} />

              <Text variant="font16Regular" color="error">
                {t('actions.delete_account')}
              </Text>
            </Button>

            <Button
              mt="sm"
              mb="lg"
              mx="md"
              height={48}
              bg="cerulean"
              alignItems="center"
              justifyContent="center"
              onPress={handleEditAccount}
              disabled={loadingCurrentUserUpdateData}
            >
              <Loader loading={loadingCurrentUserUpdateData} />

              <Text variant="font16Regular" color="white">
                {t('actions.save')}
              </Text>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default EditProfileScreen
