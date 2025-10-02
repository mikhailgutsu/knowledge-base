import React from 'react'
import { ActivityIndicator } from 'react-native'

import Box from '../Box'

import type { Color } from '@theme/index'

interface ILoaderProps {
  color?: Color
  loading: boolean
  size?: number | 'small' | 'large'
}

const Loader: React.FC<ILoaderProps> = (props) => {
  const { loading = false, size = 'small', color = 'white' } = props

  if (!loading) return null

  return (
    <Box flexDirection="row" position="absolute" right={16}>
      <ActivityIndicator size={size} color={color} />
    </Box>
  )
}

export default Loader
