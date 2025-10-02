import React from 'react'

import { Box, Button, ThemeIcon } from '@components/atoms'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

interface IPinResetHeaderProps {
  navigation: LoggedInStackScreenProps<'PinResetViaOTP'>['navigation']
}

const PinResetHeader: React.FC<IPinResetHeaderProps> = (props) => {
  const { navigation } = props

  return (
    <Box
      height={56}
      alignItems="center"
      flexDirection="row"
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

      <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />
    </Box>
  )
}

export default PinResetHeader
