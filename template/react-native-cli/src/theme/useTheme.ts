import React from 'react'

import { useAppStateStatus } from '@hooks'
import { useUpdateEffect } from 'react-use'
import { useColorScheme } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getStorageItem, setStorageItem } from '@storage'
import { useTheme as useShopifyTheme } from '@shopify/restyle'
import { saveThemeState } from '@store/themeState/themeState.actions'
import { selectThemeState } from '@store/themeState/themeState.selectors'

import type { Theme, ThemeType } from './utils/theme'

export const useTheme = () => {
  const dispatch = useDispatch()

  const shopifyTheme = useShopifyTheme<Theme>()

  const { appStateStatus } = useAppStateStatus()

  const { themeMode } = useSelector(selectThemeState)

  const systemColorScheme = useColorScheme() ?? 'dark'

  const loadTheme = React.useCallback(async () => {
    const storedTheme = await getStorageItem<ThemeType>('themeMode')

    if (!storedTheme && appStateStatus === 'active') {
      dispatch(saveThemeState(systemColorScheme))
    }
  }, [dispatch, systemColorScheme, appStateStatus])

  useUpdateEffect(() => {
    loadTheme()
  })

  const toggleTheme = async (isDark: boolean) => {
    const newTheme: ThemeType = isDark ? 'dark' : 'light'
    await setStorageItem('themeMode', newTheme)
    dispatch(saveThemeState(newTheme))
  }

  return { ...shopifyTheme, isDarkTheme: themeMode === 'dark', toggleTheme }
}
