import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'

import { Box, Text, Button, Screen, ThemeIcon, BackgroundLines } from '@components/atoms'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const AddDeviceSuccessfulCodeScreen: React.FC<
  LoggedInStackScreenProps<'AddDeviceSuccessfulCode'>
> = (props) => {
  const { navigation } = props

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
      </Box>

      <Box flex={1} px="md" my="md" justifyContent="space-between">
        
        <BackgroundLines />
        
        <Box flex={1} alignItems="center" justifyContent="center">
          <ThemeIcon icon="SuccesIcon" />

          <Text variant="font24Bold" textAlign="center" color="secondary" mt="xl">
            {t('addDevice.device_code_entered_successfuly')}
          </Text>

          <Text
            mt="xs"
            textAlign="center"
            variant="font14SemiBold"
            color="silverstone_to_steel"
          >
            {t('addDevice.can_start_configuring_device')}
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

export default AddDeviceSuccessfulCodeScreen
