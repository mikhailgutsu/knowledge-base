import React from 'react'
import { t } from 'i18next'
import {
  DrawerItem,
  DrawerItemList,
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { Toast } from 'react-native-toast-notifications'
import { type NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useShowAlert } from '@hooks'
import { useDispatch } from 'react-redux'
import { useTheme } from '@theme/useTheme'
import { socialSignout } from '@helpers/social'
import { useNavigation } from '@react-navigation/native'
import { saveAuthState } from '@store/authState/authState.actions'
import { getStorageItem, removeStorageItems, setStorageItem } from '@storage'

import env from '@env'

import { Box } from '@components/atoms'
import { useAxiosRequest } from '@api/hooks'

import { USER_SING_OUT_ENDPOINT } from '@endpoints'

import type { LoggedOutStackParamList } from '../logged-out/logged-out.types'

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { colors, textVariants } = useTheme()

  const dispatch = useDispatch()

  const showAlert = useShowAlert()

  const loggedOutNavigation =
    useNavigation<NativeStackNavigationProp<LoggedOutStackParamList>>()

  const [callUserSignout] = useAxiosRequest(USER_SING_OUT_ENDPOINT, 'post')

  const handleLogout = async () => {
    showAlert({
      cancelable: true,
      cancelText: t('actions.cancel'),
      title: t('drawer.show_alert_logout_title'),
      message: t('drawer.show_alert_logout_message'),
      onPressText: t('drawer.show_alert_logout_title'),
      onPress: async () => {
        socialSignout()

        const mobileToken = await getStorageItem<string>('fcmToken')
        const userToken = await getStorageItem<string>(env.USER_TOKEN)

        if (!!userToken && !!mobileToken) {
          return await callUserSignout(
            { mobileToken },
            async (response) => {
              if (response.status === 200) {
                dispatch(saveAuthState(false))
                await setStorageItem<boolean>('isAuthenticated', false)

                Toast.show(t('drawer.signed_out_successfuly'), { type: 'success' })

                await removeStorageItems([env.USER_TOKEN, 'SOCIAL_TYPE'])

                return loggedOutNavigation.navigate('X3')
              }
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
        }
      },
    })
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <Box>
        <DrawerItemList {...props} />
      </Box>

      <Box>
        <DrawerItem
          label={t('drawer.about_app')}
          labelStyle={{
            color: colors.secondary,
            fontSize: textVariants.font16SemiBold.fontSize,
          }}
          onPress={() => props.navigation.navigate('AboutApp')}
        />
        <DrawerItem
          onPress={handleLogout}
          label={t('drawer.log_out')}
          labelStyle={{
            color: colors.error,
            fontSize: textVariants.font16SemiBold.fontSize,
          }}
        />
      </Box>
    </DrawerContentScrollView>
  )
}

export default React.memo(CustomDrawerContent)
