import { RootState } from '../store.types'
import { createSelector } from '@reduxjs/toolkit'

export const selectAuthState = (state: RootState) => state.authState

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (authState) => authState.isAuthenticated
)
