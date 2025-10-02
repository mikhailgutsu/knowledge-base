import React from 'react'

import { Screen, Box, ThemeIcon } from '@components/atoms'

const SplashScreen: React.FC = () => {
  return (
    <Screen hiddenStatusBar bg="charcoal_to_white">
      <Box flex={1} alignItems="center" justifyContent="center">
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

        <ThemeIcon icon="ElectraIcon" color="ivory_to_charcoal" />
      </Box>
    </Screen>
  )
}

export default SplashScreen
