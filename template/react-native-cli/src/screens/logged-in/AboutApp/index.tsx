import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'

import { Screen, ScrollView, Box, Text, Button, ThemeIcon } from '@components/atoms'

import type { LoggedInDrawerScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const AboutAppScreen: React.FC<LoggedInDrawerScreenProps<'AboutApp'>> = (props) => {
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
      <Box
        px="sm"
        height={56}
        flexDirection="row"
        alignItems="center"
        bg="ivory_to_charcoal"
        justifyContent="space-between"
      >
        <Button
          width={30}
          height={56}
          alignItems="center"
          justifyContent="center"
          onPress={navigation.goBack}
        >
          <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
        </Button>

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />

        <Button onPress={navigation.openDrawer}>
          <ThemeIcon icon="MenuIcon" color="charcoal_to_ivory" />
        </Button>
      </Box>

      <ScrollView mx="md">
        <Text my="lg" variant="font24Bold" color="secondary" textAlign="center">
          {t('aboutApp.electra_about_app')}
        </Text>

        <Box alignItems="center">
          <Box
            mb="lg"
            width={65}
            height={65}
            bg="cerulean"
            borderRadius={65}
            alignItems="center"
            justifyContent="center"
          >
            <ThemeIcon icon="EIcon" color="white" width={35} height={35} />
          </Box>

          <Text variant="font14Regular" color="ivory_to_steel">
            {t('aboutApp.electra_app_description')}
          </Text>
        </Box>

        <Box mt="md" alignItems="center">
          <Box
            mb="lg"
            width={65}
            height={65}
            bg="cerulean"
            borderRadius={65}
            alignItems="center"
            justifyContent="center"
          >
            <ThemeIcon icon="SecurityIcon" color="white" />
          </Box>

          <Text variant="font14Regular" color="ivory_to_steel">
            {t('aboutApp.electra_security_description')}
          </Text>
        </Box>

        <Box my="md" alignItems="center">
          <Box
            mb="lg"
            width={65}
            height={65}
            bg="cerulean"
            borderRadius={65}
            alignItems="center"
            justifyContent="center"
          >
            <ThemeIcon icon="SmartIcon" color="white" />
          </Box>

          <Text variant="font14Regular" color="ivory_to_steel">
            {t('aboutApp.electra_smart_home_integration_description')}
          </Text>
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default AboutAppScreen
