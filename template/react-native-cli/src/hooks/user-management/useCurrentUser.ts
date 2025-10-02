import React from 'react'

import { useDispatch } from 'react-redux'
import { useAxiosRequest } from '@api/hooks'
import { getStorageItem, setStorageItem } from '@storage'
import { saveCurrentUser } from '@store/currentUser/currentUser.actions'

import env from '@env'
import { USER_DATA_ENDPOINT } from '@endpoints'

import type { ICurrentUserResponse } from '@typings/user'

const useCurrentUser = () => {
  const dispatch = useDispatch()

  const [callUserData, { loading: loadingCurrentUserData }] =
    useAxiosRequest<ICurrentUserResponse>(USER_DATA_ENDPOINT, 'get')

  const [currentUserData, setCurrentUserData] =
    React.useState<ICurrentUserResponse | null>(null)

  const [currentUserAvatar, setCurrentUserAvatar] = React.useState<string | null>(null)

  const fetchCurrentUserData = React.useCallback(async () => {
    const userToken = await getStorageItem<string>(env.USER_TOKEN)

    if (!!userToken) {
      return await callUserData(
        undefined,
        async (response) => {
          if (response.status === 200) {
            setCurrentUserData(response.data)

            dispatch(saveCurrentUser(response.data))
            await setStorageItem<ICurrentUserResponse>('currentUser', response.data)

            const avatar = await getStorageItem<string>(`avatar-${response.data.email}`)

            if (avatar) {
              setCurrentUserAvatar(avatar)
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
    }
  }, [callUserData])

  return {
    currentUserData,
    currentUserAvatar,
    setCurrentUserData,
    setCurrentUserAvatar,
    fetchCurrentUserData,
    loadingCurrentUserData,
  }
}

export default useCurrentUser
