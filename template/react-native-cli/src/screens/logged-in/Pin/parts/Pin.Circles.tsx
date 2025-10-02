import React from 'react'

import { Box } from '@components/atoms'

interface IPinCirclesProps {
  pin: string
}

const PinCircles: React.FC<IPinCirclesProps> = (props) => {
  const { pin } = props

  return (
    <Box flexDirection="row">
      {[...Array(4)].map((_, index) => (
        <Box
          width={15}
          height={15}
          key={index}
          borderRadius={10}
          marginHorizontal="xs"
          bg={index < pin.length ? 'cerulean' : 'slate'}
        />
      ))}
    </Box>
  )
}

export default PinCircles
