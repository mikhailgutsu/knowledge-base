import React from 'react'
import { createBox } from '@shopify/restyle'

import { type ScrollViewProps as SWP, ScrollView as RNScrollView } from 'react-native'

import type { Theme } from '@theme/index'

const ScrollView = createBox<Theme, SWP>(RNScrollView)

ScrollView.defaultProps = {
  flex: 1,
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  contentInsetAdjustmentBehavior: 'automatic',
}

export type ScrollViewProps = React.ComponentProps<typeof ScrollView>

export default ScrollView
