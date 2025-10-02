import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useAxiosRequest } from '@api/hooks'
import { getStorageItem, setStorageItem } from '@storage'

import * as PIN_RESET_VIA_EMAIL_PARTS from './parts'
import { BackgroundLines, Box, Screen, ScrollView } from '@components/atoms'

import env from '@env'
import { USER_PIN_CODE_EMAIL_SEND_ENDPOINT } from '@endpoints'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const PinResetViaEmailScreen: React.FC<LoggedInStackScreenProps<'PinResetViaEmail'>> = (
  props
) => {
  const { navigation } = props

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [callForgotPinEmailSend, { loading }] = useAxiosRequest(
    USER_PIN_CODE_EMAIL_SEND_ENDPOINT,
    'get'
  )

  const handleSendCodeViaEmail = async (): Promise<void> => {
    const userToken = await getStorageItem(env.USER_TOKEN)

    await callForgotPinEmailSend(
      undefined,
      async (response) => {
        if (response.status === 200) {
          await setStorageItem(env.TEMPORARY_TOKEN, response.data.token)

          return navigation.navigate('PinResetViaOTP')
        }
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <PIN_RESET_VIA_EMAIL_PARTS.PinResetHeader navigation={navigation} />

      <ScrollView
        mb="md"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <BackgroundLines />

        <Box flex={1} paddingHorizontal="md" justifyContent="space-between">
          <Box my="xl">
            <PIN_RESET_VIA_EMAIL_PARTS.PinResetTitle />

            <PIN_RESET_VIA_EMAIL_PARTS.PinResetSubtitle />
          </Box>

          <PIN_RESET_VIA_EMAIL_PARTS.PinResetSendCodeButton
            loading={loading}
            handleSendCodeViaEmail={handleSendCodeViaEmail}
          />
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default PinResetViaEmailScreen
