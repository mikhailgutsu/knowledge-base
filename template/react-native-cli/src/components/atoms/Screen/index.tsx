import React from 'react'
import { ActivityIndicator } from 'react-native'
import { type Edge } from 'react-native-safe-area-context'

import { SafeAreaView, Box } from '@components/atoms'
import ScreenWithScrolling from './parts/with-scrolling'
import ScreenWithoutScrolling from './parts/without-scrolling'

import { getEdges } from './util'

import type { ScreenProps } from './type'

const Screen: React.FC<ScreenProps> = (props) => {
  const { loading, ...restProps } = props

  const edges = React.useMemo<Edge[]>(() => {
    return getEdges(restProps.excludeEdges, restProps?.hiddenStatusBar || false)
  }, [restProps.excludeEdges, restProps.hiddenStatusBar])

  const actualUnsafe = React.useMemo<boolean>(
    () => restProps.unsafe || edges.length <= 0,
    [edges.length, restProps.unsafe]
  )

  const Wrapper = actualUnsafe ? Box : SafeAreaView

  if (loading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator />
      </Box>
    )
  }

  if (restProps.scroll) {
    return ScreenWithScrolling(Wrapper, { ...restProps, actualUnsafe, edges })
  }

  return ScreenWithoutScrolling(Wrapper, { ...restProps, actualUnsafe, edges })
}

export { Screen, type ScreenProps }
