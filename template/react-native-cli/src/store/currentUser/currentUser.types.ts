export interface ICurrentUser {
  email: string
  fullName: string
  devices?: IDevice[]
}
export interface IDevice {
  device: Device
  userRole: 'DEVICE_OWNER' | 'DEVICE_VIEWER'
}
export interface Device {
  deviceName: string
  users: IUserGroup[]
  serialNumber: string
}

export interface IUserGroup {
  first: IUserDetails
  second: 'DEVICE_OWNER' | 'DEVICE_VIEWER'
}

export interface IUserDetails {
  first: string
  second: string
}
