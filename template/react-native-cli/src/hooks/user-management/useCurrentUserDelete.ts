import React from 'react'
import { t } from 'i18next'
import RNFS from 'react-native-fs'
import * as Keychain from 'react-native-keychain'
import { Toast } from 'react-native-toast-notifications'

import { useDispatch } from 'react-redux'
import { useAxiosRequest } from '@api/hooks'
import { saveAuthState } from '@store/authState/authState.actions'
import { deleteCurrentUser } from '@store/currentUser/currentUser.actions'
import { getStorageItem, removeStorageItems, setStorageItem } from '@storage'

import env from '@env'
import { OS } from 'src/constants'
import { USER_DELETE_DATA_ENDPOINT } from '@endpoints'

interface ICurrentUserDeleteAvatarKeychain {
  email: string
}

const useCurrentUserDelete = () => {
  const dispatch = useDispatch()

  const [callDeleteUserData, { loading: loadingCurrentUserDeleteData }] = useAxiosRequest(
    USER_DELETE_DATA_ENDPOINT,
    'delete'
  )

  const fetchCurrentUserDeleteData = React.useCallback(
    async (currentUserDeleteAvatarKeychain: ICurrentUserDeleteAvatarKeychain) => {
      const { email } = currentUserDeleteAvatarKeychain

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callDeleteUserData(
          undefined,
          async (response) => {
            if (response.status === 200) {
              Toast.show(t('Succes to delete account'), { type: 'success' })

              const dirPath =
                OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath
              const directoryFiles = await RNFS.readDir(dirPath)
              const imagesToDelete = directoryFiles.filter((file) =>
                file.name.startsWith(`ELECTRA_DEVICE_`)
              )

              imagesToDelete.map(({ path }) => RNFS.unlink(path))

              await Keychain.resetGenericPassword({ service: email })

              await removeStorageItems([
                'device',
                'currentUser',
                env.USER_TOKEN,
                `avatar-${email}`,
              ])

              dispatch(deleteCurrentUser())

              dispatch(saveAuthState(false))
              await setStorageItem<boolean>('isAuthenticated', false)
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
    [callDeleteUserData]
  )

  return {
    fetchCurrentUserDeleteData,
    loadingCurrentUserDeleteData,
  }
}

export default useCurrentUserDelete
