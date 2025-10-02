import React from 'react'
import { t } from 'i18next'

import { Box, Text } from '@components/atoms'

const PinResetSubtitle: React.FC = () => {
  return (
    <Box mt="sm" borderWidth={1} borderColor="succes" py="extraSmall" px="md">
      <Text variant="font14SemiBold" textAlign="center" color="succes">
        {t('pinResetViaOTP.pin_verification_email_check')}
      </Text>
    </Box>
  )
}

export default PinResetSubtitle
