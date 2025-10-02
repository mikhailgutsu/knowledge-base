import React from 'react'
import { createText } from '@shopify/restyle'

import type { Theme } from '@theme/index'

const Text = createText<Theme>()

Text.defaultProps = { color: 'silver' }

export type TextProps = React.ComponentProps<typeof Text>

export default Text
