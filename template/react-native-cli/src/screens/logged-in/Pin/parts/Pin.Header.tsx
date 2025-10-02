import React from 'react'

import { Box, ThemeIcon } from '@components/atoms'

const PinHeader: React.FC = () => {
  return (
    <Box height={56} alignItems="center" bg="ivory_to_charcoal" justifyContent="center">
      <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />
    </Box>
  )
}

export default PinHeader
