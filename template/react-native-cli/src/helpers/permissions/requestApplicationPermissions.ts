import { requestPermissionsIOS, requestPermissionsANDROID } from '@helpers/index'

import { OS } from 'src/constants'

export const requestApplicationPermissions = async () => {
  if (OS === 'ios') {
    await requestPermissionsIOS()
  }

  if (OS === 'android') {
    await requestPermissionsANDROID()
  }
}
