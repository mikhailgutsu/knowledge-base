import { createAction } from '@reduxjs/toolkit'

import type { ICurrentUser, IDevice } from './currentUser.types'

const SAVE_CURRENT_USER = 'SAVE_CURRENT_USER'
const SAVE_CURRENT_USER_EMAIL = 'SAVE_CURRENT_USER_EMAIL'
const SAVE_CURRENT_USER_DEVICES = 'SAVE_CURRENT_USER_DEVICES'
const SAVE_CURRENT_USER_FULL_NAME = 'SAVE_CURRENT_USER_FULL_NAME'

const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER'
const DELETE_CURRENT_USER = 'DELETE_CURRENT_USER'
const UPDATE_CURRENT_USER_DEVICE = 'UPDATE_CURRENT_USER_DEVICE'

export const saveCurrentUser = createAction<ICurrentUser>(SAVE_CURRENT_USER)

export const saveCurrentUserEmail = createAction<ICurrentUser['email']>(
  SAVE_CURRENT_USER_EMAIL
)
export const saveCurrentUserDevices = createAction<ICurrentUser['devices']>(
  SAVE_CURRENT_USER_DEVICES
)
export const saveCurrentUserFullName = createAction<ICurrentUser['fullName']>(
  SAVE_CURRENT_USER_FULL_NAME
)

export const updateCurrentUser = createAction<ICurrentUser>(UPDATE_CURRENT_USER)
export const updateCurrentUserDevice = createAction<IDevice>(UPDATE_CURRENT_USER_DEVICE)

export const deleteCurrentUser = createAction<void>(DELETE_CURRENT_USER)
