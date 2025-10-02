import React from 'react'
import { t } from 'i18next'
import { Toast } from 'react-native-toast-notifications'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { INVITE_CONFIRM_ENDPOINT } from '@endpoints'
import { useNavigation } from '@react-navigation/native'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

interface IUserConfirmInvitationPayload {
  code: string
  serialNumber: string
}

const useUserConfirmInvitation = () => {
  const [callUserConfirmInvitation, { loading: loadingUserConfirmInvitation }] =
    useAxiosRequest(INVITE_CONFIRM_ENDPOINT, 'post')

  const navigation = useNavigation<LoggedInStackScreenProps<'AddDevice'>['navigation']>()

  const fetchUserConfirmInvitation = React.useCallback(
    async (userConfirmInvitationPayload: IUserConfirmInvitationPayload) => {
      const { serialNumber, code } = userConfirmInvitationPayload

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callUserConfirmInvitation(
          { serialNumber, code },
          async (response) => {
            if (response.status === 200) {
              Toast.show(t('invitationViaEmail.invitation_confirmed'), {
                type: 'success',
              })
              return navigation.navigate('Dashboard')
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
    [callUserConfirmInvitation]
  )

  return {
    fetchUserConfirmInvitation,
    loadingUserConfirmInvitation,
  }
}

export default useUserConfirmInvitation
