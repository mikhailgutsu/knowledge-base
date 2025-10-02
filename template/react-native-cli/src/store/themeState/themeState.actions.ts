import { createAction } from '@reduxjs/toolkit'

import type { ThemeType } from '@theme/index'

export const saveThemeState = createAction<ThemeType>('themeState/saveTheme')
