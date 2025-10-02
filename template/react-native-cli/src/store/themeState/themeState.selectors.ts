import { RootState } from '../store.types'
import { createSelector } from '@reduxjs/toolkit'

export const selectThemeState = (state: RootState) => state.themeState

export const selectThemeMode = createSelector(
  selectThemeState,
  (themeState) => themeState.themeMode
)
