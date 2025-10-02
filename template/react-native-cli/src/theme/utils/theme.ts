import { createTheme } from '@shopify/restyle'
import { FONTS, METRICS_SIZES } from './constants'
import { DARK_THEME_BASE_COLORS, LIGHT_THEME_BASE_COLORS } from './colors'

const BASE_THEME = {
  textVariants: FONTS,
  spacing: METRICS_SIZES,
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
}

const lightTheme = createTheme({
  ...BASE_THEME,
  colors: LIGHT_THEME_BASE_COLORS,
})

const darkTheme = createTheme({
  ...BASE_THEME,
  colors: DARK_THEME_BASE_COLORS,
})

export const theme = {
  dark: darkTheme,
  light: lightTheme,
}

export type ThemeType = keyof typeof theme

export type Theme = typeof theme.light
export type Color = keyof Theme['colors']
export type Spacing = keyof Theme['spacing']
