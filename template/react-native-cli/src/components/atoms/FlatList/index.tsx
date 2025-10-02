import React from 'react'
import {
  FlatList as RNFlatList,
  type FlatListProps as NativeFlatListProps,
} from 'react-native'

export type FlatListProps<T> = NativeFlatListProps<T> & {
  data: T[]
  showsVerticalScrollIndicator?: boolean
  showsHorizontalScrollIndicator?: boolean
}

const FlatList = React.forwardRef<RNFlatList<any>, FlatListProps<any>>(
  <T,>(props: FlatListProps<T>, ref: React.Ref<RNFlatList<T>>) => {
    const {
      data = [],
      showsVerticalScrollIndicator = false,
      showsHorizontalScrollIndicator = false,
      ...restFlatListProps
    } = props

    return (
      <RNFlatList<T>
        ref={ref}
        data={data}
        removeClippedSubviews={false}
        keyExtractor={(_, index) => `item-${index}`}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        {...restFlatListProps}
      />
    )
  }
)

export default FlatList
