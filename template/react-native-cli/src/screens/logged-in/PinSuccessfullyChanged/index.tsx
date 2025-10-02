import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'

import { BackgroundLines, Box, Button, Screen, Text, ThemeIcon } from '@components/atoms'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const PinSuccessfullyChangedScreen: React.FC<
  LoggedInStackScreenProps<'PinSuccessfullyChanged'>
> = (props) => {
  const { navigation } = props

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const handleContinue = () => navigation.navigate('WelcomeBack')

  return (
    <Screen
      bg="charcoal_to_white"
      statusBarStyle={statusBarStyle}
      statusColor="white_to_charcoal"
    >
      <BackgroundLines />

      <Box bg="ivory_to_charcoal" height={56} alignItems="center" justifyContent="center">
        <ThemeIcon icon="ElectraIcon" color="charcoal_to_ivory" width={156} height={23} />
      </Box>

      <Box flex={1} px="md" my="md" justifyContent="space-between">
        <Box alignItems="center" flex={0.7} justifyContent="center">
          <ThemeIcon icon={'SuccesIcon'} />

          <Text variant="font24Bold" textAlign="center" color="secondary" mt="xl">
            {t('successfully.pin_changed_success')}
          </Text>

          <Text variant="font14SemiBold" textAlign="center" color="secondary" mt="xs">
            {t('successfully.can_use_pin')}
          </Text>
        </Box>

        <Button
          mt="sm"
          height={48}
          bg="cerulean"
          alignItems="center"
          justifyContent="center"
          onPress={handleContinue}
        >
          <Text variant="font16Regular" color="white">
            {t('actions.continue')}
          </Text>
        </Button>
      </Box>
    </Screen>
  )
}

export default PinSuccessfullyChangedScreen
