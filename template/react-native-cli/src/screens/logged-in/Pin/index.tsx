import React from 'react'

import { usePinLogic } from './hooks'
import { useTheme } from '@theme/useTheme'
import { useRemoveHardwareBackHandler } from '@hooks'

import * as PIN_PARTS from './parts'
import { BackgroundLines, Box, Screen } from '@components/atoms'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const PinScreen: React.FC<LoggedInStackScreenProps<'Pin'>> = (props) => {
  const { route } = props

  const isNewPin = route.params?.isNewPin ?? false

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  useRemoveHardwareBackHandler({ type: true })

  const {
    pin,
    isCreating,
    handleClearPin,
    handleCreateNewPin,
    handleConfirmPinsMatch,
    handleNumberButtonPress,
    handleRemoveLastPinNumber,
    handleNavigateToPinResetViaEmail,
  } = usePinLogic({ isNewPin })

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <BackgroundLines />

      <PIN_PARTS.PinHeader />

      <Box flex={1} pb="xl" paddingHorizontal="md">
        <Box flex={1} alignItems="center" justifyContent="space-evenly">
          <PIN_PARTS.PinTitle isCreating={isCreating} isConfirming={!isNewPin} />

          <PIN_PARTS.PinCircles pin={pin} />

          <PIN_PARTS.PinNumberButtons
            pin={pin}
            handleClearPin={handleClearPin}
            handleNumberButtonPress={handleNumberButtonPress}
            handleRemoveLastPinNumber={handleRemoveLastPinNumber}
          />
        </Box>

        {!isCreating && (
          <PIN_PARTS.PinCreateClearButtons
            handleClearPin={handleClearPin}
            handleCreateNewPin={handleCreateNewPin}
          />
        )}

        {isCreating && isNewPin && (
          <PIN_PARTS.PinConfirmButton handleConfirmPinsMatch={handleConfirmPinsMatch} />
        )}

        {isCreating && !isNewPin && (
          <PIN_PARTS.PinForgetButton
            handleNavigateToPinResetViaEmail={handleNavigateToPinResetViaEmail}
          />
        )}
      </Box>
    </Screen>
  )
}

export default PinScreen
