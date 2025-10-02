import React from 'react'
import { t } from 'i18next'
import { Toast } from 'react-native-toast-notifications'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'
import { useNavigation } from '@react-navigation/native'

import env from '@env'
import { DEVICE_DELETE_USER_ENDPOINT } from '@endpoints'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

interface IDeviceDeleteUser {
  email: string
  serialNumber: string
}

const useDeviceDeleteUser = () => {
  const [callDeviceDeleteUser, { loading: loadingDeviceDeleteUserData }] =
    useAxiosRequest(DEVICE_DELETE_USER_ENDPOINT, 'delete')

  const navigation =
    useNavigation<LoggedInStackScreenProps<'DeviceSettings'>['navigation']>()

  const fetchDeviceDeleteUserData = React.useCallback(
    async (currentDeviceDeleteUser: IDeviceDeleteUser) => {
      const { serialNumber, email } = currentDeviceDeleteUser

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callDeviceDeleteUser(
          { serialNumber, email },
          async (response) => {
            if (response.status === 200) {
              Toast.show(t('users.success_to_delete_user'), {
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
    [callDeviceDeleteUser]
  )

  return {
    fetchDeviceDeleteUserData,
    loadingDeviceDeleteUserData,
  }
}

export default useDeviceDeleteUser
