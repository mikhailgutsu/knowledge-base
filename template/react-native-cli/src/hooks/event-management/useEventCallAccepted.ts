import React from 'react'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { EVENT_CALL_ACCEPTED } from '@endpoints'

const useEventCallAccepted = () => {
  const [callEventCallAccepted] = useAxiosRequest(EVENT_CALL_ACCEPTED, 'post')

  const fetchEventCallAccepted = React.useCallback(
    async (serialNumber: string) => {
      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callEventCallAccepted(
          { serialNumber },
          async (response) => {
            if (response.status === 200) {
              console.log('useEventCallAccepted: ', response.data)
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
    [callEventCallAccepted]
  )

  return {
    fetchEventCallAccepted,
  }
}

export default useEventCallAccepted
