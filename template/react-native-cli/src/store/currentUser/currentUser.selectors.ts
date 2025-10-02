import type { RootState } from '../store.types'

export const selectCurrentUser = (state: RootState) => state.currentUser

export const selectCurrentUserEmail = (state: RootState) => state.currentUser.email
export const selectCurrentUserDevices = (state: RootState) => state.currentUser.devices
export const selectCurrentUserFullName = (state: RootState) => state.currentUser.fullName

export const selectCurrentUserDeviceBySerialNumber =
  (serialNumber: string) => (state: RootState) =>
    state.currentUser.devices?.find(
      (device) => device.device.serialNumber === serialNumber
    )