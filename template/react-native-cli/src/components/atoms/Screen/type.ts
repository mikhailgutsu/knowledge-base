import type { Color } from '@theme/index'
import type { BoxProps } from '@components/atoms'
import type { SafeAreaViewProps } from '../SafeAreaView'
import type { Edge } from 'react-native-safe-area-context'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

export type ScreenProps = {
  /**
   * Displays a loader if true
   * @default undefined
   */
  loading?: boolean

  /**
   * Status bar style
   * @default dark-content
   */
  statusBarStyle?: 'light-content' | 'dark-content'

  /**
   * Using safe area on ios
   * @default false
   */
  unsafe?: boolean

  /**
   * Visibility status bar
   * @default true
   */
  hiddenStatusBar?: boolean

  /**
   * Color of status bar for both Android/IOS
   */
  statusColor?: Color

  /**
   * Color of inset bottom
   * @default #ffffff
   */
  bottomInsetColor?: Color

  /**
   * Color of inset left
   * @default #ffffff
   */
  leftInsetColor?: Color

  /**
   * Color of inset left
   * @default #ffffff
   */
  rightInsetColor?: Color

  /**
   * Using scroll content
   * @default false
   */
  scroll?: boolean

  /**
   * Inset for safe area view
   * @default undefined
   */
  excludeEdges?: 'all' | Edge[]

  /**
   * Animated onScroll
   * @default undefined
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
} & SafeAreaViewProps &
  BoxProps

export type InsetComponentProps = Pick<
  ScreenProps,
  | 'statusColor'
  | 'unsafe'
  | 'hiddenStatusBar'
  | 'bottomInsetColor'
  | 'leftInsetColor'
  | 'rightInsetColor'
  | 'statusBarStyle'
> & {
  edges: Edge[]
}

export interface InsetProps {
  color?: Color
  height: number
  width: number
  top?: number
  left?: number
  right?: number
  bottom?: number
}

type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type ScreenComponentProps = CustomOmit<
  ScreenProps,
  'unsafe' | 'scroll' | 'excludeEdges'
> & {
  edges: Edge[]
  actualUnsafe: boolean
}
