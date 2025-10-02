import React from 'react'
import { Animated } from 'react-native'

import useCheckBox from './hooks/useCheckBox'

import CheckBoxTitle from './CheckBox.Title'
import { Button, ThemeIcon, Box, type BoxProps } from '@components/atoms'

import type { Theme } from '@theme/index'

interface ICheckBoxProps extends Omit<BoxProps, 'children'>, React.PropsWithChildren {
  defaultChecked?: boolean
  defaultColor?: keyof Theme['colors']
  disableAutoCheckManagement?: boolean
  checkIconColor?: keyof Theme['colors']
  onPressCheckbox: (value: boolean) => void
}

const CheckBox = (props: ICheckBoxProps) => {
  const {
    children,
    defaultColor,
    onPressCheckbox,
    defaultChecked = false,
    checkIconColor = 'silverstone',
    disableAutoCheckManagement = false,
  } = props

  const AnimatedBox = Animated.createAnimatedComponent(Box)

  const { isChecked, setIsChecked } = useCheckBox({ defaultChecked })

  return (
    <Button
      onPress={() => {
        onPressCheckbox(!isChecked)

        if (!disableAutoCheckManagement) {
          setIsChecked((prev) => !prev)
        }
      }}
    >
      <Box flexDirection="row" alignItems="center">
        <AnimatedBox
          width={20}
          height={20}
          borderWidth={1}
          borderRadius={4}
          alignItems="center"
          justifyContent="center"
          borderColor="silverstone"
          bg={isChecked ? 'charcoal_to_ivory' : defaultColor ?? 'charcoal_to_ivory'}
          {...(props as any)}
        >
          {isChecked && <ThemeIcon icon="CheckIcon" color={checkIconColor} />}
        </AnimatedBox>
        {children}
      </Box>
    </Button>
  )
}

CheckBox.Title = CheckBoxTitle

export default CheckBox
