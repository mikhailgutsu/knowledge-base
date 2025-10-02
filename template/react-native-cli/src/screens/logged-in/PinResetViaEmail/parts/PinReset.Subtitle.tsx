import React from 'react'
import { t } from 'i18next'

import { Text } from '@components/atoms'

const PinResetSubtitle: React.FC = () => {
  return (
    <Text variant="font14SemiBold" textAlign="center" color="secondary" mb="xl">
      {t('pinResetViaEmail.pin_enter_email_to_receive_code')}
    </Text>
  )
}

export default PinResetSubtitle
