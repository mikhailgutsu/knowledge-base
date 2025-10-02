import React from 'react'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { EVENT_NOTIFICATION_ALL_ENDPOINT } from '@endpoints'

interface INotification {
  at: string
  type: string
  image: string
  serialNumber: string
}

const useNotificationData = () => {
  const [callNotificationData] = useAxiosRequest(EVENT_NOTIFICATION_ALL_ENDPOINT, 'post')

  const [currentNotificationData, setCurrentNotificationData] = React.useState<
    INotification[]
  >([])

  const fetchNotificationData = React.useCallback(async () => {
    const userToken = await getStorageItem<string>(env.USER_TOKEN)

    if (!!userToken) {
      return await callNotificationData(
        undefined,
        async (response) => {
          if (response.status === 200) {
            console.log('Notification status: ', response.status)
            setCurrentNotificationData(response.data)
          }
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
    }
  }, [callNotificationData])

  return {
    fetchNotificationData,
    currentNotificationData,
    setCurrentNotificationData,
  }
}

export default useNotificationData
