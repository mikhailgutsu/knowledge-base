import { StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'
import { selectThemeState } from '@store/themeState/themeState.selectors'

import { theme, type Theme } from './utils/theme'

type BuildStylesCallback<T, Params> = (
  theme: Theme,
  params?: Params
) => StyleSheet.NamedStyles<T>

export const createStyles = <
  T extends StyleSheet.NamedStyles<T>,
  Params = object | undefined
>(
  build: BuildStylesCallback<T, Params>
) => {
  return (params?: Params) => {
    const { themeMode } = useSelector(selectThemeState)

    return StyleSheet.create(build(theme[themeMode], params))
  }
}
