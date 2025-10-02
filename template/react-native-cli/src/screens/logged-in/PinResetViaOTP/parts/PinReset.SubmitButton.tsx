import React from 'react'
import { t } from 'i18next'

import { Text, Button, Loader } from '@components/atoms'

interface IPinResetSubmitButtonProps {
  loading: boolean
  handleSubmitCode: () => Promise<void>
}

const PinResetSubmitButton: React.FC<IPinResetSubmitButtonProps> = (props) => {
  const { handleSubmitCode, loading = false } = props

  return (
    <Button
      mt="sm"
      height={48}
      bg="cerulean"
      disabled={loading}
      alignItems="center"
      justifyContent="center"
      onPress={handleSubmitCode}
    >
      <Loader loading={loading} />

      <Text ml="xs" variant="font16Regular" color="white">
        {t('actions.submit')}
      </Text>
    </Button>
  )
}

export default PinResetSubmitButton
