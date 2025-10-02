import * as React from 'react'
import {
  StatusBar as StatusBarNative,
  type StatusBarProps as StatusBarPropsNative,
} from 'react-native'

import { useIsFocused } from '@react-navigation/native'

const StatusBar: React.FC<StatusBarPropsNative> = (props) => {
  const { barStyle = 'dark-content', ...restStatusBarProps } = props

  const isFocused = useIsFocused()

  return isFocused ? (
    <StatusBarNative barStyle={barStyle} {...restStatusBarProps} />
  ) : null
}

export type StatusBarProps = StatusBarPropsNative

export default StatusBar
