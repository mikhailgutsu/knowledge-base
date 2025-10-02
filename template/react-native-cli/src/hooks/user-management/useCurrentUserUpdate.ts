import React from 'react'

import { useDispatch } from 'react-redux'
import { useAxiosRequest } from '@api/hooks'
import { getStorageItem, setStorageItem } from '@storage'
import { updateCurrentUser } from '@store/currentUser/currentUser.actions'

import env from '@env'
import { USER_DATA_UPDATE_ENDPOINT } from '@endpoints'

import type { ICurrentUserResponse } from '@typings/user'

interface ICurrentUserUpdatePayload {
  fullName: string
  password?: string
}

const useCurrentUserUpdate = () => {
  const dispatch = useDispatch()

  const [callUserUpdate, { loading: loadingCurrentUserUpdateData }] =
    useAxiosRequest<ICurrentUserResponse>(USER_DATA_UPDATE_ENDPOINT, 'post')

  const fetchCurrentUserUpdateData = React.useCallback(
    async (currentUserUpdatePayload: ICurrentUserUpdatePayload) => {
      const { fullName, password } = currentUserUpdatePayload

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callUserUpdate(
          { fullName, password },
          async (response) => {
            if (response.status === 200) {
              dispatch(updateCurrentUser(response.data))

              await setStorageItem<ICurrentUserResponse>('currentUser', response.data)
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
    [callUserUpdate]
  )

  return {
    fetchCurrentUserUpdateData,
    loadingCurrentUserUpdateData,
  }
}

export default useCurrentUserUpdate
