import React from 'react'
import { createBox } from '@shopify/restyle'
import {
  SafeAreaView as RNSaveAreaView,
  type SafeAreaViewProps as SAWP,
} from 'react-native-safe-area-context'

import type { Theme } from '@theme/index'

const SafeAreaView = createBox<Theme, SAWP>(RNSaveAreaView)

SafeAreaView.defaultProps = { flex: 1 }

export type SafeAreaViewProps = React.ComponentProps<typeof SafeAreaView>

export default SafeAreaView
