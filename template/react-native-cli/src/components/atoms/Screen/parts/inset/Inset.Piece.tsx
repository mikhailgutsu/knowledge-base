import React from 'react'

import { Box } from '@components/atoms'

import type { InsetProps } from '../../type'

const InsetPiece: React.FC<InsetProps> = (props) => {
  const { color, height, width, bottom, left, right, top } = props

  return (
    <Box
      flex={1}
      top={top}
      bg={color}
      left={left}
      right={right}
      width={width}
      height={height}
      bottom={bottom}
      position="absolute"
    />
  )
}

export default InsetPiece
