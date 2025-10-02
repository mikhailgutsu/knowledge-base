import React from 'react'
import { t } from 'i18next'

import { Box, Button, Text } from '@components/atoms'

interface IPinCreateClearButtonsProps {
  handleClearPin: () => void
  handleCreateNewPin: () => void
}

const PinCreateClearButtons: React.FC<IPinCreateClearButtonsProps> = (props) => {
  const { handleClearPin, handleCreateNewPin } = props

  return (
    <Box gap="md" height={48} alignSelf="center" flexDirection="row">
      <Button
        flex={1}
        borderWidth={1}
        alignItems="center"
        borderColor="secondary"
        justifyContent="center"
        onPress={handleClearPin}
      >
        <Text variant="font16SemiBold" color="secondary">
          {t('actions.clear')}
        </Text>
      </Button>

      <Button
        flex={1}
        bg="cerulean"
        alignItems="center"
        justifyContent="center"
        onPress={handleCreateNewPin}
      >
        <Text variant="font16SemiBold" color="secondary">
          {t('actions.create')}
        </Text>
      </Button>
    </Box>
  )
}

export default PinCreateClearButtons
