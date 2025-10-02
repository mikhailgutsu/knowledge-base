import React from 'react'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { DEVICE_DATA_ENDPOINT } from '@endpoints'

import type { Device } from '@typings/user'

const useDeviceData = (serialNumber: string) => {
  const [callDeviceData, { loading: loadingDeviceData }] = useAxiosRequest(
    `${DEVICE_DATA_ENDPOINT}?serialNumber=${serialNumber}`,
    'get'
  )

  const [currentDeviceData, setCurrentDeviceData] = React.useState<Device>()

  const fetchDeviceData = React.useCallback(async () => {
    const userToken = await getStorageItem<string>(env.USER_TOKEN)

    if (!!userToken) {
      return await callDeviceData(
        undefined,
        async (response) => {
          if (response.status === 200) {
            setCurrentDeviceData(response.data)
          }
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
    }
  }, [callDeviceData])

  return {
    fetchDeviceData,
    loadingDeviceData,
    currentDeviceData,
    setCurrentDeviceData,
  }
}

export default useDeviceData
