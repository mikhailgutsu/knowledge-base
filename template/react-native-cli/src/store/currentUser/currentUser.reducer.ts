import { createReducer, type PayloadAction } from '@reduxjs/toolkit'

import {
  saveCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
  saveCurrentUserEmail,
  saveCurrentUserDevices,
  saveCurrentUserFullName,
  updateCurrentUserDevice,
} from './currentUser.actions'

import type { ICurrentUser, IDevice } from './currentUser.types'

const initialCurrentUserState: ICurrentUser = {
  email: '',
  devices: [],
  fullName: '',
}

const currentUserReducer = createReducer(initialCurrentUserState, (builder) => {
  builder
    .addCase(saveCurrentUser, (state, action: PayloadAction<ICurrentUser>) => {
      Object.assign(state, action.payload)
    })
    .addCase(
      saveCurrentUserEmail,
      (state, action: PayloadAction<ICurrentUser['email']>) => {
        state.email = action.payload
      }
    )
    .addCase(
      saveCurrentUserFullName,
      (state, action: PayloadAction<ICurrentUser['fullName']>) => {
        state.fullName = action.payload
      }
    )
    .addCase(
      saveCurrentUserDevices,
      (state, action: PayloadAction<ICurrentUser['devices']>) => {
        state.devices = action.payload
      }
    )
    .addCase(updateCurrentUser, (state, action: PayloadAction<Partial<ICurrentUser>>) => {
      Object.assign(state, action.payload)
    })
    .addCase(updateCurrentUserDevice, (state, action: PayloadAction<IDevice>) => {
      const index = state.devices?.findIndex(
        (d) => d.device.serialNumber === action.payload.device.serialNumber
      )
      if (index !== undefined && index !== -1 && state.devices) {
        state.devices[index] = action.payload
      }
    })
    .addCase(deleteCurrentUser, () => initialCurrentUserState)
})

export default currentUserReducer
