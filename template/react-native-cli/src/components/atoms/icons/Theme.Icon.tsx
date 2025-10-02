import React from 'react'
import { createBox } from '@shopify/restyle'

import { useTheme, type Theme } from '@theme/index'

import * as ICONS from './index'

import type { SvgProps } from 'react-native-svg'

export type Icons = typeof ICONS
export type Icon = keyof typeof ICONS

type IconProps = Omit<React.ComponentProps<(typeof ICONS)[Icon]>, 'color'>

type ThemeIconProps = IconProps & {
  icon: Icon
  strokeWidth?: number
  fill?: keyof Theme['colors']
  color?: keyof Theme['colors']
}

type OverriddenProps = {
  style: IconProps[]
}

const BaseThemeIcon: React.FC<ThemeIconProps> = (props) => {
  const { children, icon, color, fill, strokeWidth, opacity, ...iconProps } = props

  const overriddenProps = (iconProps as OverriddenProps).style.reduce(
    (acc, cur) => ({ ...acc, ...cur }),
    {}
  )

  const { colors } = useTheme()

  const FILL = fill ? { fill: colors[fill] } : {}
  const COLOR = color ? { color: colors[color] } : {}
  const IconElement = ICONS[icon] as React.FC<SvgProps>

  return (
    <IconElement
      {...COLOR}
      {...FILL}
      {...{ strokeWidth, opacity }}
      {...overriddenProps}
    />
  )
}

const ThemeIcon = createBox<Theme, ThemeIconProps>(BaseThemeIcon)

export default ThemeIcon
