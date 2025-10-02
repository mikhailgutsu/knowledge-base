import React from 'react'

import ScreenInset from '../inset'
import { ScrollView, type BoxProps, type SafeAreaViewProps } from '@components/atoms'

import type { Color } from '@theme/index'
import type { ScreenComponentProps } from '../../type'

function ScreenWithScrolling(
  Wrapper: React.ComponentType<BoxProps | SafeAreaViewProps>,
  props: ScreenComponentProps
) {
  const {
    edges,
    style,
    onScroll,
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
      <Wrapper
        flex={1}
        edges={edges}
        bg="transparent"
        justifyContent="flex-start"
        {...rest}
      >
        <ScrollView
          bg={bg}
          flex={1}
          width="100%"
          onScroll={onScroll}
          children={children}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[{ paddingBottom: 16 }, style]}
        />
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

export default ScreenWithScrolling
