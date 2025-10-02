import React from 'react'

import { Button, Box, ThemeIcon } from '@components/atoms'

interface ISwitchProps {
  value: boolean
  isTheme?: boolean
  onValueChange: (value: boolean) => void
}

const Switch: React.FC<ISwitchProps> = (props) => {
  const { value = false, onValueChange = () => false, isTheme = false } = props

  return (
    <Button
      width={50}
      height={25}
      borderRadius={25}
      justifyContent="center"
      bg={value ? 'cerulean' : 'silver'}
      onPress={() => onValueChange(!value)}
    >
      <Box
        width={20}
        height={20}
        borderRadius={10}
        alignItems="center"
        justifyContent="center"
        style={{ marginHorizontal: 3 }}
        bg={isTheme && value ? 'ebony' : 'white'}
        alignSelf={value ? 'flex-end' : 'flex-start'}
      >
        {isTheme && (
          <ThemeIcon color={value ? 'gold' : 'graphite'} icon="WeatherSunIcon" />
        )}
      </Box>
    </Button>
  )
}

export default Switch
