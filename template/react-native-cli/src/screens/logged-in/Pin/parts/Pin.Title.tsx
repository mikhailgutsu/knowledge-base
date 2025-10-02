import React from 'react'
import { t } from 'i18next'

import { Text } from '@components/atoms'

import { WIDTH } from 'src/constants'

interface IPinTitleProps {
  isCreating: boolean
  isConfirming: boolean
}

const PinTitle: React.FC<IPinTitleProps> = (props) => {
  const { isConfirming, isCreating } = props

  return (
    <Text color="secondary" variant={WIDTH < 375 ? 'font24Bold' : 'font28Bold'}>
      {!isCreating
        ? t('pin.pin_create_new')
        : !isConfirming
        ? t('pin.pin_confirm')
        : t('pin.pin_enter')}
    </Text>
  )
}

export default PinTitle
