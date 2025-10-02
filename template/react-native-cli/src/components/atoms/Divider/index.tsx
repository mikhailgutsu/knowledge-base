import React from 'react'

import { Box, type BoxProps } from '@components/atoms'

import type { Color } from '@theme/index'

interface IDividerProps extends BoxProps {
  color?: Color
}

const Divider: React.FC<IDividerProps> = (props) => {
  const { color = 'graphite', ...boxProps } = props

  return <Box width="100%" height={1} bg={color} {...boxProps} />
}

export default Divider
