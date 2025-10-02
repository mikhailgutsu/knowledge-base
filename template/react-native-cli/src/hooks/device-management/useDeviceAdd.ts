import React from 'react'
import { t } from 'i18next'
import { Toast } from 'react-native-toast-notifications'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'
import { useNavigation } from '@react-navigation/native'

import env from '@env'
import { DEVICE_ADD_ENDPOINT } from '@endpoints'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

interface IDeviceAddPayload {
  fcmToken?: string
  deviceName: string
  serialNumber: string
}

const useAddDevice = () => {
  const [callDeviceAdd, { loading: loadingDeviceAdd }] = useAxiosRequest(
    DEVICE_ADD_ENDPOINT,
    'post'
  )

  const navigation = useNavigation<LoggedInStackScreenProps<'AddDevice'>['navigation']>()

  const fetchDeviceAdd = React.useCallback(
    async (deviceAddPayload: IDeviceAddPayload) => {
      const { deviceName, serialNumber, fcmToken } = deviceAddPayload

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callDeviceAdd(
          { deviceName, serialNumber, fcmToken },
          async (response) => {
            if (response.status === 201) {
              Toast.show(t('addDevice.device_added_successufy'), { type: 'success' })
              if (fcmToken) {
                return navigation.navigate('AddDeviceSuccessfulQRCode', {
                  key: t('addDevice.qrcode_added'),
                })
              }
              return navigation.navigate('AddDeviceSuccessfulCode')
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
    [callDeviceAdd]
  )

  return {
    fetchDeviceAdd,
    loadingDeviceAdd,
  }
}

export default useAddDevice
