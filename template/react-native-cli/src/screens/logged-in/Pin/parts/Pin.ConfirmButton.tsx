import React from 'react'
import { t } from 'i18next'

import { Box, Button, Text } from '@components/atoms'

interface IPinConfirmButtonProps {
  handleConfirmPinsMatch: () => void
}

const PinConfirmButton: React.FC<IPinConfirmButtonProps> = (props) => {
  const { handleConfirmPinsMatch } = props

  return (
    <Box gap="md" height={48} alignSelf="center" flexDirection="row">
      <Button
        flex={1}
        bg="cerulean"
        alignItems="center"
        justifyContent="center"
        onPress={handleConfirmPinsMatch}
      >
        <Text variant="font16SemiBold" color="secondary">
          {t('actions.confirm')}
        </Text>
      </Button>
    </Box>
  )
}

export default PinConfirmButton
