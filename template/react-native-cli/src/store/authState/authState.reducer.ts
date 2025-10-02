import { saveAuthState } from './authState.actions'
import { createReducer, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
}

const authReducer = createReducer(initialState, (builder) => {
  builder.addCase(saveAuthState, (state, action: PayloadAction<boolean>) => {
    state.isAuthenticated = action.payload
  })
})

export default authReducer
