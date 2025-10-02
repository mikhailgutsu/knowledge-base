import React from 'react'
import { t } from 'i18next'

import { Text } from '@components/atoms'

const PinResetTitle: React.FC = () => {
  return (
    <Text variant="font28Bold" color="secondary" textAlign="center">
      {t('pinResetViaOTP.pin_email_verify')}
    </Text>
  )
}

export default PinResetTitle
