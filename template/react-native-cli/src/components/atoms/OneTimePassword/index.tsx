import React from 'react'
import {
  Cursor,
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'

import { Box, BoxProps, Button, Text, ThemeIcon } from '@components/atoms'

import { OS } from 'src/constants'

interface IOneTimePasswordProps extends BoxProps {
  value: string
  cellCount?: number
  isCorrect: boolean | null
  setValue: React.Dispatch<React.SetStateAction<string>>
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>
}

const OneTimePassword: React.FC<IOneTimePasswordProps> = (props) => {
  const {
    setValue,
    value = '',
    setIsCorrect,
    cellCount = 4,
    isCorrect = null,
    ...boxProps
  } = props

  const formattedValue = value.replace(/[^0-9]/g, '')

  const ref = useBlurOnFulfill({ value, cellCount })
  const [valueProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    const focusedCellIndex = value.length
    if (focusedIndex !== focusedCellIndex) {
      setFocusedIndex(focusedCellIndex)
    }
  }, [value, focusedIndex, setFocusedIndex])

  return (
    <Box {...boxProps}>
      <Box alignItems="center" flexDirection="row" mx="sm">
        <CodeField
          ref={ref}
          {...valueProps}
          cellCount={cellCount}
          value={formattedValue}
          onChangeText={setValue}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={OS === 'android' ? 'sms-otp' : 'one-time-code'}
          renderCell={(renderCellProps) => {
            const { index, symbol, isFocused } = renderCellProps

            const borderColor = isFocused
              ? 'cerulean'
              : isCorrect === null
              ? 'slate'
              : isCorrect
              ? 'cerulean'
              : 'error'

            const borderLeftWidth = isFocused
              ? 2
              : index > 0 && focusedIndex === index - 1
              ? 0
              : 1
            const borderRightWidth = isFocused
              ? 2
              : index < cellCount - 1 && focusedIndex === index + 1
              ? 0
              : 1

            return (
              <Button
                width={49}
                height={53}
                key={index}
                alignItems="center"
                justifyContent="center"
                borderColor={borderColor}
                borderWidth={isFocused ? 2 : 1}
                borderLeftWidth={borderLeftWidth}
                borderRightWidth={borderRightWidth}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <Text variant="font16Regular" color='secondary'>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </Button>
            )
          }}
        />

        <Box width={0}>
          {isCorrect !== null && (
            <React.Fragment>
              {!isCorrect ? (
                <Button
                  onPress={() => {
                    setValue('')
                    setIsCorrect(null)
                  }}
                >
                  <ThemeIcon ml="sm" icon="ErrorIcon" />
                </Button>
              ) : (
                <ThemeIcon ml="sm" icon="ValidIcon" />
              )}
            </React.Fragment>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default OneTimePassword
