import React from 'react'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { EVENT_NOTIFICATION_DEVICE_ENDPOINT } from '@endpoints'

interface INotification {
  at: string
  type: string
  image: string
  serialNumber: string
}

const useNotificationPerDeviceData = () => {
  const [callNotificationPerDeviceData] = useAxiosRequest(
    EVENT_NOTIFICATION_DEVICE_ENDPOINT,
    'post'
  )

  const [currentNotificationPerDeviceData, setCurrentNotificationPerDeviceData] =
    React.useState<INotification[]>([])

  const fetchNotificationPerDeviceData = React.useCallback(
    async (serialNumber: string) => {
      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callNotificationPerDeviceData(
          { serialNumber },
          async (response) => {
            if (response.status === 200) {
              console.log('Notification status: ', response.status)
              setCurrentNotificationPerDeviceData(response.data)
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
    [callNotificationPerDeviceData]
  )

  return {
    fetchNotificationPerDeviceData,
    currentNotificationPerDeviceData,
    setCurrentNotificationPerDeviceData,
  }
}

export default useNotificationPerDeviceData
