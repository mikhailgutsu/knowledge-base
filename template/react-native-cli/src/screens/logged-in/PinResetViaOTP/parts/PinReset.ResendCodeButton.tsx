import React from 'react'
import { t } from 'i18next'

import { Text, Button, Loader } from '@components/atoms'

interface IPinResetResendCodeButtonProps {
  loading: boolean
  handleResendCode: () => Promise<void>
}

const PinResetResendCodeButton: React.FC<IPinResetResendCodeButtonProps> = (props) => {
  const { handleResendCode, loading = false } = props

  return (
    <Button
      mt="sm"
      height={48}
      borderWidth={1}
      disabled={loading}
      alignItems="center"
      borderColor="secondary"
      justifyContent="center"
      onPress={handleResendCode}
    >
      <Loader loading={loading} />

      <Text variant="font16Regular" color="secondary">
        {t('actions.resend_code')}
      </Text>
    </Button>
  )
}

export default PinResetResendCodeButton
