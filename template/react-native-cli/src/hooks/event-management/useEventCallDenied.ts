import React from 'react'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { EVENT_CALL_DENIED } from '@endpoints'

const useEventCallDenied = () => {
  const [callEventCallDenied] = useAxiosRequest(EVENT_CALL_DENIED, 'post')

  const fetchEventCallDenied = React.useCallback(
    async (serialNumber: string) => {

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callEventCallDenied(
          { serialNumber },
          async (response) => {
            if (response.status === 200) {
              console.log('useEventCallDenied: ', response.data)
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
    [callEventCallDenied]
  )

  return {
    fetchEventCallDenied,
  }
}

export default useEventCallDenied
