import React from 'react'
import { t } from 'i18next'
import { Toast } from 'react-native-toast-notifications'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'
import { useNavigation } from '@react-navigation/native'

import env from '@env'
import { DEVICE_UPDATTE_ROLE_ENDPOINT } from '@endpoints'

import type { Device } from '@typings/user'
import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

interface IDeviceUpdateRolePayload {
  email: string
  newRole: string
  serialNumber: string
}

const useDeviceUpdateRole = () => {
  const [callDeviceUpdateRole, { loading: loadingDeviceUpdateRole }] =
    useAxiosRequest<Device>(DEVICE_UPDATTE_ROLE_ENDPOINT, 'post')

  const navigation = useNavigation<LoggedInStackScreenProps<'Users'>['navigation']>()

  const fetchDeviceUpdateRole = React.useCallback(
    async (deviceUpdateRolePayload: IDeviceUpdateRolePayload) => {
      const { serialNumber, email, newRole } = deviceUpdateRolePayload

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callDeviceUpdateRole(
          { serialNumber, email, newRole },
          async (response) => {
            if (response.status === 200) {
              Toast.show(t('users.success_to_update_role'), {
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
    [callDeviceUpdateRole]
  )

  return {
    fetchDeviceUpdateRole,
    loadingDeviceUpdateRole,
  }
}

export default useDeviceUpdateRole
