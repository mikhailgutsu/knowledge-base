import React from 'react'
import { ActivityIndicator } from 'react-native'
import * as Keychain from 'react-native-keychain'

import { Settings } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import {
  validateName,
  validateEmail,
  loginAndOptionallySaveCredentials,
} from '@helpers/index'
import { useDispatch } from 'react-redux'
import { useTheme } from '@theme/useTheme'
import { useAxiosRequest } from '@api/hooks'
import { useTranslation } from 'react-i18next'
import * as SOCIAL_SIGNIN from '@helpers/social'
import { getStorageItem, setStorageItem } from '@storage'
import { useToast } from 'react-native-toast-notifications'
import { saveAuthState } from '@store/authState/authState.actions'
import { saveCurrentUser } from '@store/currentUser/currentUser.actions'

import {
  Box,
  Text,
  Input,
  Button,
  Screen,
  CheckBox,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import {
  USER_DATA_ENDPOINT,
  AUTH_SIGNIN_ENDPOINT,
  AUTH_SOCIALS_SIGNIN_ENDPOINT,
} from '@endpoints'
import env from '@env'

import type {
  IAuthParams,
  ISocialSigninApple,
  ISocialSingninResponse,
} from '@typings/social'
import type { ICurrentUserResponse } from '@typings/user'
import type { LoggedOutStackScreenProps } from '@navigation/stacks/logged-out/logged-out.types'

Settings.initializeSDK()

GoogleSignin.configure({
  webClientId: env.GOOGLE_SIGNIN_WEB_CLIENT_ID,
  iosClientId: env.GOOGLE_SIGNIN_IOS_CLIENT_ID,
  offlineAccess: true,
  scopes: ['profile', 'email'],
})

interface ISigninResponse {
  token: string
}

interface ISigninMethod {
  (args: ISocialSigninApple): Promise<void>
}

const LoginScreen: React.FC<LoggedOutStackScreenProps<'Login'>> = (props) => {
  const { navigation } = props

  const toast = useToast()

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [callLogin, { loading }] = useAxiosRequest<ISigninResponse>(
    AUTH_SIGNIN_ENDPOINT,
    'post'
  )

  const [callAuthSocialsLogin] = useAxiosRequest<ISocialSingninResponse>(
    AUTH_SOCIALS_SIGNIN_ENDPOINT,
    'post'
  )
  const [callUserData] = useAxiosRequest<ICurrentUserResponse>(USER_DATA_ENDPOINT, 'get')

  const [email, setEmail] = React.useState({ value: '', error: '' })
  const [password, setPassword] = React.useState({ value: '', error: '' })

  const [isChecked, setIsChecked] = React.useState<boolean>(false)
  const [isAutofilled, setIsAutofilled] = React.useState<boolean>(false)

  const socialLoginMethod = async (appleAuthParams: IAuthParams) => {
    await callAuthSocialsLogin(appleAuthParams, async (socialSingninResponse) => {
      if (socialSingninResponse.status === 200) {
        await setStorageItem<string>(env.USER_TOKEN, socialSingninResponse.data.token)

        dispatch(saveAuthState(true))
        await setStorageItem<boolean>('isAuthenticated', true)

        await callUserData(
          undefined,
          async (currentUserResponse) => {
            if (currentUserResponse.status === 200) {
              dispatch(saveCurrentUser(currentUserResponse.data))

              await setStorageItem<ICurrentUserResponse>(
                'currentUser',
                currentUserResponse.data
              )
            }
          },
          { headers: { Authorization: `Bearer ${socialSingninResponse.data.token}` } }
        )
      }
    })
  }

  const handleLogin = async () => {
    const emailValidation = validateEmail({
      email: email.value,
      validEmail: t('register.email_is_not_valid'),
      emailCannotBeEmpty: t('register.email_cant_be_empty'),
    })

    const passwordValidation = validateName({
      name: password.value,
      nameCannotBeEmpty: t('resetPassword.password_cannot_be_empty'),
    })

    setEmail((prev) => ({ ...prev, error: emailValidation || '' }))
    setPassword((prev) => ({ ...prev, error: passwordValidation || '' }))

    if (emailValidation || passwordValidation) {
      return
    }

    try {
      const mobileToken = await getStorageItem<string>('fcmToken')

      if (mobileToken !== null) {
        return await callLogin(
          { email: email.value, password: password.value, mobileToken },
          async (signinResponse) => {
            if (signinResponse.status === 200) {
              dispatch(saveAuthState(true))
              await setStorageItem<boolean>('isAuthenticated', true)
              await setStorageItem(env.USER_TOKEN, signinResponse.data.token)

              await callUserData(undefined, async (currentUserResponse) => {
                if (currentUserResponse.status === 200) {
                  dispatch(saveCurrentUser(currentUserResponse.data))

                  await setStorageItem<ICurrentUserResponse>(
                    'currentUser',
                    currentUserResponse.data
                  )
                }
              })

              const credentials = await Keychain.getGenericPassword({
                service: email.value,
              })

              if (isChecked) {
                await loginAndOptionallySaveCredentials({
                  email: email.value,
                  password: password.value,
                })
              } else if (credentials && email.value === credentials.service) {
                await Keychain.resetGenericPassword({ service: email.value })
              }
            }
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    const autofillCredentials = async () => {
      try {
        const storedServices = await getStorageItem<string>('services')

        const credentials = await Keychain.getGenericPassword({
          service: storedServices ?? '',
        })

        if (credentials) {
          setIsChecked(true)
          setIsAutofilled(true)
          setEmail({ value: credentials.service, error: '' })
          setPassword({ value: credentials.password, error: '' })
        }
      } catch (error) {
        console.log('Failed to load credentials', error)
      }
    }

    autofillCredentials()
  }, [])

  const handlePasswordChange = (text: string) => {
    if (isAutofilled) {
      setIsAutofilled(false)
      setPassword({ value: '', error: '' })
    } else {
      setPassword({ value: text, error: '' })
    }
  }

  const handleAuth = async (socialLoginParams: IAuthParams) => {
    return socialLoginMethod(socialLoginParams)
  }

  const handleSocialSignin = async (signinMethod: ISigninMethod) => {
    try {
      return await signinMethod({ handleAuth, dispatch, toast })
    } catch (error) {
      if (__DEV__) {
        console.log('handleSocialSignin', error)
      }
    }
  }

  const toggleCheckbox = () => setIsChecked((prev) => !prev)

  return (
    <Screen
      bg="charcoal_to_white"
      statusBarStyle={statusBarStyle}
      statusColor="white_to_charcoal"
    >
      <Box height={56} alignItems="center" bg="ivory_to_charcoal" justifyContent="center">
        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />
      </Box>

      <ScrollView automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
        <Box mx="md">
          <Text variant="font24Bold" textAlign="center" my="md" color="secondary">
            {t('login.login')}
          </Text>

          <Text
            mb="md"
            textAlign="center"
            variant="font14SemiBold"
            color="silverstone_to_steel"
          >
            {t('login.welcome_back')}
          </Text>

          <Input
            value={email.value}
            placeholder="Email"
            autoCorrect={false}
            isLoginScreen={true}
            autoComplete="email"
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={(text) => setEmail({ value: text, error: '' })}
          />
          {email.error && (
            <Text color="error" variant="font13SemiBold">
              {email.error}
            </Text>
          )}

          <Box mt="sm">
            <Input
              secureTextEntry
              autoCorrect={false}
              returnKeyType="next"
              isLoginScreen={true}
              autoCapitalize="none"
              placeholder="Password"
              value={password.value}
              autoComplete="password"
              isAutoFill={isAutofilled}
              textContentType="password"
              setIsAutoFill={setIsAutofilled}
              onChangeText={handlePasswordChange}
            />
            {password.error && (
              <Text color="error" variant="font13SemiBold">
                {password.error}
              </Text>
            )}
          </Box>

          <CheckBox my="md" defaultChecked={isChecked} onPressCheckbox={toggleCheckbox}>
            <CheckBox.Title ml="xs" title="Remember information" />
          </CheckBox>

          <Button
            height={48}
            width="100%"
            bg="cerulean"
            alignItems="center"
            onPress={handleLogin}
            justifyContent="center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text color="white" variant="font16SemiBold">
                {t('login.login')}
              </Text>
            )}
          </Button>

          <Button my="sm" onPress={() => navigation.navigate('ResetEmail')}>
            <Text color="cerulean" textAlign="center">
              {t('login.forgot_password')}
            </Text>
          </Button>

          <Box flexDirection="row" alignItems="center">
            <Box flex={1} height={1} bg="silverstone_to_steel" />
            <Text variant="font14SemiBold" color="silverstone_to_steel" mx="sm">
              or
            </Text>
            <Box flex={1} height={1} bg="silverstone_to_steel" />
          </Box>

          <Box width="100%" my="sm">
            <Button
              py="sm"
              mb="md"
              px="md"
              borderWidth={1}
              alignItems="center"
              flexDirection="row"
              borderColor="silver"
              bg="charcoal_to_ivory"
              onPress={() => handleSocialSignin(SOCIAL_SIGNIN.googleSignin)}
            >
              <ThemeIcon mr="sm" icon="SocialGoogleIcon" />

              <Box mr="sm" width={2} bg="silver" height={25} borderRadius={1} />

              <Text variant="font16SemiBold" color="silverstone_to_steel">
                {t('login.google_login')}
              </Text>
            </Button>

            <Button
              py="sm"
              mb="md"
              px="md"
              borderWidth={1}
              alignItems="center"
              flexDirection="row"
              borderColor="silver"
              bg="charcoal_to_ivory"
              onPress={() => handleSocialSignin(SOCIAL_SIGNIN.facebookSignin)}
            >
              <ThemeIcon mr="sm" icon="SocialFacebookIcon" />

              <Box mr="sm" width={2} height={25} borderRadius={1} bg="silver" />

              <Text variant="font16SemiBold" color="silverstone_to_steel">
                {t('login.facebbok_login')}
              </Text>
            </Button>

            <Button
              py="sm"
              px="md"
              borderWidth={1}
              alignItems="center"
              flexDirection="row"
              borderColor="silver"
              bg="charcoal_to_ivory"
              onPress={() => handleSocialSignin(SOCIAL_SIGNIN.appleSingin)}
            >
              <ThemeIcon mr="sm" icon="SocialAppleIcon" color="secondary" />

              <Box mr="sm" width={2} bg="silver" height={25} borderRadius={1} />

              <Text variant="font16SemiBold" color="silverstone_to_steel">
                {t('login.apple_login')}
              </Text>
            </Button>
          </Box>

          <Button mb="md" onPress={() => navigation.navigate('Register')}>
            <Text textAlign="center" color="silverstone_to_steel">
              {t('login.first_time_here')}
              <Text color="cerulean"> {t('login.sign_up_for_free')}</Text>
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default LoginScreen
