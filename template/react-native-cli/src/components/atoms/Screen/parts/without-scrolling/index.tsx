import React from 'react'

import ScreenInset from '../inset'
import { Box, type BoxProps, type SafeAreaViewProps } from '@components/atoms'

import type { Color } from '@theme/index'
import type { ScreenComponentProps } from '../../type'

function ScreenWithoutScrolling(
  Wrapper: React.ComponentType<BoxProps | SafeAreaViewProps>,
  props: ScreenComponentProps
) {
  const {
    edges,
    children,
    actualUnsafe,
    statusBarStyle,
    bg = 'transparent',
    leftInsetColor = bg,
    rightInsetColor = bg,
    bottomInsetColor = bg,
    hiddenStatusBar = false,
    statusColor = undefined,
    ...rest
  } = props

  return (
    <React.Fragment>
      <Wrapper edges={edges} flex={1} width="100%" bg={bg} {...rest}>
        <Box flex={1} children={children} />
      </Wrapper>

      <ScreenInset
        edges={edges}
        unsafe={actualUnsafe}
        statusColor={statusColor}
        statusBarStyle={statusBarStyle}
        hiddenStatusBar={hiddenStatusBar}
        leftInsetColor={leftInsetColor as Color}
        rightInsetColor={rightInsetColor as Color}
        bottomInsetColor={bottomInsetColor as Color}
      />
    </React.Fragment>
  )
}

export default ScreenWithoutScrolling
