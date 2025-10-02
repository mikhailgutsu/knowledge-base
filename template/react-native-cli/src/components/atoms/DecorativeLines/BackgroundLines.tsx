import React from 'react'

import { Box, ThemeIcon } from '@components/atoms'

const BackgroundLines: React.FC = () => {
  return (
    <Box
      flex={1}
      left={0}
      top={200}
      right={0}
      bottom={0}
      position="absolute"
      justifyContent="center"
    >
      <ThemeIcon icon="DecorativeLines" color="graphite_to_silverstone" />
    </Box>
  )
}

export default BackgroundLines
