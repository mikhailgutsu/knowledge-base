import React from 'react'
import { t } from 'i18next'
import { type GestureResponderEvent } from 'react-native'

import { Text, Loader, Button } from '@components/atoms'

interface IPinResetSendCodeButtonProps {
  loading: boolean
  handleSendCodeViaEmail: (event: GestureResponderEvent) => Promise<void>
}

const PinResetSendCodeButton: React.FC<IPinResetSendCodeButtonProps> = (props) => {
  const { handleSendCodeViaEmail, loading = false } = props

  return (
    <Button
      height={48}
      bg="cerulean"
      disabled={loading}
      alignItems="center"
      flexDirection="row"
      justifyContent="center"
      onPress={handleSendCodeViaEmail}
    >
      <Loader loading={loading} />

      <Text color="white" textAlign="center" variant="font16SemiBold">
        {t('actions.send_verification_code')}
      </Text>
    </Button>
  )
}

export default PinResetSendCodeButton
