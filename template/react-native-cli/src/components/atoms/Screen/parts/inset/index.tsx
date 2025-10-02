import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import InsetPiece from './Inset.Piece'
import { StatusBar } from '@components/atoms'

import type { InsetComponentProps } from '../../type'

const ScreenInset: React.FC<InsetComponentProps> = (props) => {
  const {
    edges,
    unsafe,
    leftInsetColor,
    hiddenStatusBar,
    rightInsetColor,
    bottomInsetColor,
    statusColor = 'transparent',
    statusBarStyle = 'dark-content',
  } = props

  const { colors } = useTheme()

  const inset = useSafeAreaInsets()

  const { width: screenWidth, height: screenHeight } = useWindowDimensions()

  return (
    <React.Fragment>
      <StatusBar
        hidden={hiddenStatusBar}
        barStyle={statusBarStyle}
        backgroundColor={colors[statusColor]}
      />

      {!unsafe && edges.includes('top') && (
        <InsetPiece color={statusColor} top={0} height={inset.top} width={screenWidth} />
      )}

      {!unsafe && edges.includes('left') && (
        <InsetPiece
          left={0}
          width={inset.left}
          height={screenHeight}
          color={leftInsetColor}
        />
      )}

      {!unsafe && edges.includes('right') && (
        <InsetPiece
          right={0}
          width={inset.right}
          height={screenHeight}
          color={rightInsetColor}
        />
      )}

      {!unsafe && edges.includes('bottom') && (
        <InsetPiece
          bottom={0}
          width={screenWidth}
          height={inset.bottom}
          color={bottomInsetColor}
        />
      )}
    </React.Fragment>
  )
}

export default ScreenInset
