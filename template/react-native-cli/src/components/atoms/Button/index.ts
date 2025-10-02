import React from 'react'
import { createBox } from '@shopify/restyle'
import { Pressable, type PressableProps } from 'react-native'

import type { Theme } from '@theme/index'

const Button = createBox<Theme, PressableProps>(Pressable)

export type ButtonProps = React.ComponentProps<typeof Button>

export default Button
