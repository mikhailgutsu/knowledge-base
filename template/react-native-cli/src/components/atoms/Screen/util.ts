import type { ScreenProps } from './type'
import type { Edge } from 'react-native-safe-area-context'

const INSETS: Edge[] = ['top', 'bottom', 'left', 'right']

const getEdges = (
  excludeEdges: ScreenProps['excludeEdges'],
  hiddenStatusBar: boolean
) => {
  if (excludeEdges === 'all') {
    return []
  }

  const actualEdges = INSETS.filter((x) => !(excludeEdges ?? []).includes(x))

  if (hiddenStatusBar) {
    return actualEdges.filter((x) => x !== 'top')
  }

  return actualEdges
}

export { getEdges }
