import React from 'react'
import { t } from 'i18next'
import { Toast } from 'react-native-toast-notifications'

import { getStorageItem } from '@storage'
import { useAxiosRequest } from '@api/hooks'

import env from '@env'
import { INVITE_ENDPOINT } from '@endpoints'

interface IUserInvitationPayload {
  role: string
  email: string
  serialNumber: string
}

const useUserInvitation = () => {
  const [callUserInvitation, { loading: loadingUserInvitation }] = useAxiosRequest(
    INVITE_ENDPOINT,
    'post'
  )

  const fetchUserInvitation = React.useCallback(
    async (userInvitationPayload: IUserInvitationPayload) => {
      const { serialNumber, email, role } = userInvitationPayload

      const userToken = await getStorageItem<string>(env.USER_TOKEN)

      if (!!userToken) {
        return await callUserInvitation(
          { serialNumber, email, role },
          async (response) => {
            if (response.status === 200) {
              Toast.show(`${t('invitationViaEmail.sending_invitation')} ${email}`, {
                type: 'success',
              })
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
    [callUserInvitation]
  )

  return {
    fetchUserInvitation,
    loadingUserInvitation,
  }
}

export default useUserInvitation
