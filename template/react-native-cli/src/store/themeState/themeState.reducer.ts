import { saveThemeState } from './themeState.actions'
import { createReducer, PayloadAction } from '@reduxjs/toolkit'

import type { ThemeType } from '@theme/index'
import type { ThemeState } from './themeState.types'

const initialState: ThemeState = {
  themeMode: 'dark',
}

const themeReducer = createReducer(initialState, (builder) => {
  builder.addCase(saveThemeState, (state, action: PayloadAction<ThemeType>) => {
    state.themeMode = action.payload
  })
})

export default themeReducer
