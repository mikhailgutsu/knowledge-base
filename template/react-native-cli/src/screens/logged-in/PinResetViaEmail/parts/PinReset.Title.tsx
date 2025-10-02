import React from 'react'
import { t } from 'i18next'

import { Text } from '@components/atoms'

const PinResetTitle: React.FC = () => {
  return (
    <Text variant="font28Bold" color="secondary" textAlign="center" mb="xs">
      {t('pinResetViaEmail.pin_reset')}
    </Text>
  )
}

export default PinResetTitle
