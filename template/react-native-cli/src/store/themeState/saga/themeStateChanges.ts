import { Appearance } from 'react-native'

import { getStorageItem } from '@storage'
import { call, put } from 'redux-saga/effects'
import { saveThemeState } from '../themeState.actions'

import type { ThemeType } from '@theme/index'

export function* loadThemeSaga() {
  try {
    const themeMode: ThemeType = yield call(getStorageItem, 'themeMode')

    const systemColorScheme = Appearance.getColorScheme() ?? 'dark'

    if (themeMode) {
      yield put(saveThemeState(themeMode))
    } else {
      yield put(saveThemeState(systemColorScheme))
    }
  } catch (error) {
    console.error('error loading theme:', error)
    yield put(saveThemeState('dark'))
  }
}
