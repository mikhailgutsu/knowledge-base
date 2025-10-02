import React from 'react'
import { t } from 'i18next'
import { Toast } from 'react-native-toast-notifications'

import { useDispatch } from 'react-redux'
import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { DEVICE_UPDATE_ENDPOINT } from '@endpoints'

import { useNavigation } from '@react-navigation/native'
import { updateCurrentUserDevice } from '@store/currentUser/currentUser.actions'

import type { Device, IDevice } from '@typings/user'
import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

interface IDeviceUpdatePayload {
  serialNumber: string
  newDeviceName: string
}

const useDeviceupdate = () => {
  const dispatch = useDispatch()

  const [callDeviceUpdate, { loading: loadingDeviceUpdateData }] =
    useAxiosRequest<Device>(DEVICE_UPDATE_ENDPOINT, 'post')

  const navigation =
    useNavigation<LoggedInStackScreenProps<'DeviceSettings'>['navigation']>()

  const fetchDeviceUpdateData = React.useCallback(
    async (deviceUpdatePayload: IDeviceUpdatePayload) => {
      const { serialNumber, newDeviceName } = deviceUpdatePayload

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callDeviceUpdate(
          { serialNumber, newDeviceName },
          async (response) => {
            console.log('response', response)
            if (response.status === 200) {
              const updatedDevice: IDevice = {
                device: {
                  users: [],
                  deviceName: response.data.deviceName,
                  serialNumber: response.data.serialNumber,
                },
                userRole: 'DEVICE_OWNER',
              }

              dispatch(updateCurrentUserDevice(updatedDevice))

              Toast.show(t('deviceSettings.device_update_successfuly'), {
                type: 'success',
              })

              navigation.goBack()
            }
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
      }
    },
    [callDeviceUpdate]
  )

  return {
    fetchDeviceUpdateData,
    loadingDeviceUpdateData,
  }
}

export default useDeviceupdate
