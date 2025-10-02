import React from 'react'
import QRCode from 'react-native-qrcode-svg'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'

import { Box, Text, Button, Screen, ThemeIcon } from '@components/atoms'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const AddDeviceSuccessfulQRCodeScreen: React.FC<
  LoggedInStackScreenProps<'AddDeviceSuccessfulQRCode'>
> = (props) => {
  const { navigation, route } = props

  const key = route.params.key

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <Box>
        <Box
          height={56}
          alignItems="center"
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

          <ThemeIcon
            width={156}
            height={23}
            icon="ElectraIcon"
            color="charcoal_to_ivory"
          />
        </Box>

        <ThemeIcon icon="SuccesIcon" mt="xl" width={42} height={42} alignSelf="center" />

        <Text variant="font24Bold" color="secondary" textAlign="center" mt="lg">
          {t('addDevice.scan_successful')}
        </Text>
      </Box>

      <Box flex={1}>
        <Box
          flex={1}
          width={230}
          height={230}
          alignSelf="center"
          alignItems="center"
          justifyContent="center"
        >
          <Box padding="lg">
            <QRCode
              size={158}
              value={key}
              color="black"
              quietZone={20}
              logoMargin={2}
              logoBorderRadius={20}
              backgroundColor="white"
              logoBackgroundColor="transparent"
              logo={require('@assets/png/electra.png')}
            />

            <Box
              top={0}
              left={0}
              width={80}
              height={80}
              borderTopWidth={3}
              borderLeftWidth={3}
              position="absolute"
              borderColor="cerulean"
            />
            <Box
              top={0}
              right={0}
              width={80}
              height={80}
              borderTopWidth={3}
              position="absolute"
              borderRightWidth={3}
              borderColor="cerulean"
            />
            <Box
              left={0}
              width={80}
              bottom={0}
              height={80}
              position="absolute"
              borderLeftWidth={3}
              borderBottomWidth={3}
              borderColor="cerulean"
            />
            <Box
              right={0}
              bottom={0}
              width={80}
              height={80}
              position="absolute"
              borderRightWidth={3}
              borderBottomWidth={3}
              borderColor="cerulean"
            />
          </Box>

          <Text variant="font14SemiBold" textAlign="center" mt="lg">
            Device 1
          </Text>
        </Box>
      </Box>

      <Button
        mb="md"
        mx="md"
        height={48}
        bg="cerulean"
        alignItems="center"
        justifyContent="center"
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text variant="font16SemiBold" color="white">
          {t('actions.continue')}
        </Text>
      </Button>
    </Screen>
  )
}

export default AddDeviceSuccessfulQRCodeScreen
