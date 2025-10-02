import { createAction } from '@reduxjs/toolkit'

export const saveAuthState = createAction<boolean>('authState/saveAuth')
