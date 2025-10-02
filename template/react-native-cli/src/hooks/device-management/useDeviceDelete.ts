import React from 'react'
import { t } from 'i18next'
import RNFS from 'react-native-fs'
import { Toast } from 'react-native-toast-notifications'

import { useAxiosRequest } from '@api/hooks'
import { getStorageItem, removeStorageItems } from '@storage'

import env from '@env'
import { OS } from 'src/constants'
import { DEVICE_DELETE_ENDPOINT } from '@endpoints'

interface IDeviceDelete {
  serialNumber: string
}

const useDeviceDelete = () => {
  const [callDeviceDelete, { loading: loadingDeviceDeleteData }] = useAxiosRequest(
    DEVICE_DELETE_ENDPOINT,
    'delete'
  )

  const fetchDeviceDeleteData = React.useCallback(
    async (currentDeviceDelete: IDeviceDelete) => {
      const { serialNumber } = currentDeviceDelete

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callDeviceDelete(
          { serialNumber },
          async (response) => {
            if (response.status === 201) {
              Toast.show(t('deviceSettings.device_remove_successfuly'), {
                type: 'success',
              })

              const dirPath =
                OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath
              const directoryFiles = await RNFS.readDir(dirPath)
              const imagesToDelete = directoryFiles.filter((file) =>
                file.name.startsWith(`ELECTRA_DEVICE_${serialNumber}`)
              )

              imagesToDelete.map(({ path }) => RNFS.unlink(path))

              await removeStorageItems([`device${serialNumber}`])
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
    [callDeviceDelete]
  )

  return {
    fetchDeviceDeleteData,
    loadingDeviceDeleteData,
  }
}

export default useDeviceDelete
