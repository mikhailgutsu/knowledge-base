import React from 'react'
import { createBox } from '@shopify/restyle'

import type { Theme } from '@theme/index'

const Box = createBox<Theme>()

Box.defaultProps = {
  zIndex: 1,
  width: 'auto',
  height: 'auto',
  margin: 'zero',
  padding: 'zero',
  flexDirection: 'column',
}

export type BoxProps = React.ComponentProps<typeof Box>

export default Box
