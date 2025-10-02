import { createAction } from '@reduxjs/toolkit'

const INTERNET_STATE_CHANGED = 'INTERNET_STATE_CHANGED'

export const internetStateChanged = createAction<boolean>(INTERNET_STATE_CHANGED)
