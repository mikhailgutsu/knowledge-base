import React from 'react'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { EVENT_CALL_MISSED } from '@endpoints'

const useEventCallMissed = () => {
  const [callEventCallMissed] = useAxiosRequest(EVENT_CALL_MISSED, 'post')

  const fetchEventCallMissed = React.useCallback(
    async (serialNumber: string) => {
      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callEventCallMissed(
          { serialNumber },
          async (response) => {
            if (response.status === 200) {
              console.log('useEventCallMissed: ', response.data)
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
    [callEventCallMissed]
  )

  return {
    fetchEventCallMissed,
  }
}

export default useEventCallMissed
