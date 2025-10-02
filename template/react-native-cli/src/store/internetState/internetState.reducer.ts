import { internetStateChanged } from './internetState.actions'
import { createReducer, PayloadAction } from '@reduxjs/toolkit'

import type { InternetState } from './internetState.types'

const initialState: InternetState = {
  isConnected: false,
}

const internetReducer = createReducer(initialState, (builder) => {
  builder.addCase(internetStateChanged, (state, action: PayloadAction<boolean>) => {
    state.isConnected = action.payload
  })
})

export default internetReducer
