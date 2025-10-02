import React from 'react'

import { Language } from '@components/molecules'
import { Box, Button, Screen, ThemeIcon } from '@components/atoms'

import type { LoggedInDrawerScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const LanguageScreen: React.FC<LoggedInDrawerScreenProps<'CHANGE LANGUAGE'>> = (
  props
) => {
  const { navigation } = props

  return (
    <Screen bg="charcoal_to_white" statusColor="white_to_charcoal">
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

      <Language />
    </Screen>
  )
}

export default LanguageScreen
