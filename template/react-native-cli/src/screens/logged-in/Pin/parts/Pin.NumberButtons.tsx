import React from 'react'

import { useTheme } from '@theme/useTheme'

import { Box, Button, Text } from '@components/atoms'

import { PIN_BUTTONS } from '../constants'

interface IPinNumberButtonsProps {
  pin: string
  handleClearPin: () => void
  handleRemoveLastPinNumber: () => void
  handleNumberButtonPress: (value: string) => void
}

const PinNumberButtons: React.FC<IPinNumberButtonsProps> = (props) => {
  const { pin, handleNumberButtonPress, handleRemoveLastPinNumber, handleClearPin } =
    props

  const { colors } = useTheme()

  const handlePressButton = React.useCallback(
    (num: string) => {
      if (num === PIN_BUTTONS.backspace) {
        return handleRemoveLastPinNumber()
      }

      return handleNumberButtonPress(num)
    },
    [handleNumberButtonPress, handleRemoveLastPinNumber]
  )

  return (
    <Box>
      {PIN_BUTTONS.matrix.map((row, rowIndex) => (
        <Box key={rowIndex} flexDirection="row">
          {row.map((num) => {
            if (num === PIN_BUTTONS.backspace && pin.length === 0) {
              return null
            }

            const isDisabledPinNumberButtons =
              pin.length === 4 && num !== PIN_BUTTONS.backspace

            return num !== PIN_BUTTONS.empty ? (
              <Button
                elevation={5}
                borderRadius={40}
                alignItems="center"
                justifyContent="center"
                key={`${rowIndex}-${num}`}
                onLongPress={handleClearPin}
                width={PIN_BUTTONS.style.width}
                height={PIN_BUTTONS.style.height}
                margin={PIN_BUTTONS.style.margin}
                disabled={isDisabledPinNumberButtons}
                onPress={() => handlePressButton(num)}
                style={({ pressed }) => {
                  return {
                    backgroundColor: pressed ? colors.cerulean : colors.graphite_to_pearl,
                  }
                }}
              >
                <Text variant="font28SemiBold" color="secondary">
                  {num}
                </Text>
              </Button>
            ) : (
              <Box
                key={`${rowIndex}-empty`}
                width={PIN_BUTTONS.style.width}
                height={PIN_BUTTONS.style.height}
                margin={PIN_BUTTONS.style.margin}
              />
            )
          })}
        </Box>
      ))}
    </Box>
  )
}

export default React.memo(PinNumberButtons)
