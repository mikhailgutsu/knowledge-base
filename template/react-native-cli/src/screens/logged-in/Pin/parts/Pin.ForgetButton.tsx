import React from 'react'
import { t } from 'i18next'

import { Button, Text } from '@components/atoms'

interface IPinForgetButtonProps {
  handleNavigateToPinResetViaEmail: () => void
}

const PinForgetButton: React.FC<IPinForgetButtonProps> = (props) => {
  const { handleNavigateToPinResetViaEmail } = props

  return (
    <Button
      height={48}
      justifyContent="center"
      onPress={handleNavigateToPinResetViaEmail}
    >
      <Text variant="font16SemiBold" color="cerulean" textAlign="center">
        {t('actions.forget_pin')}
      </Text>
    </Button>
  )
}

export default PinForgetButton
