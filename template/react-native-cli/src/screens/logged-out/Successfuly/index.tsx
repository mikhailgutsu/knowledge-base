import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'

import { Box, Button, Screen, Text, ThemeIcon } from '@components/atoms'

import type { LoggedOutStackScreenProps } from '@navigation/stacks/logged-out/logged-out.types'

const SuccessfulyScreen: React.FC<LoggedOutStackScreenProps<'Successfuly'>> = (props) => {
  const { navigation } = props

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const handleContinue = () => {
    navigation.navigate('Pincode', { value: false })
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusBarStyle={statusBarStyle}
      statusColor="white_to_charcoal"
    >
      <Box bg="ivory_to_charcoal" height={56} alignItems="center" justifyContent="center">
        <ThemeIcon icon="ElectraIcon" color="charcoal_to_ivory" width={156} height={23} />
      </Box>

      <Box flex={1} px="md" my="md" justifyContent="space-between">
        <Box alignItems="center" flex={0.7} justifyContent="center">
          <ThemeIcon icon={'SuccesIcon'} />

          <Text variant="font24Bold" textAlign="center" color="secondary" mt="xl">
            {t('successfully.pin_created_success')}
          </Text>

          <Text
            mt="xs"
            textAlign="center"
            variant="font14SemiBold"
            color="silverstone_to_steel"
          >
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

export default SuccessfulyScreen
