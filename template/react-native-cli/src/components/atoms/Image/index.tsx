import React from 'react'
import FastImage, { type FastImageProps } from 'react-native-fast-image'

const Image: React.FC<FastImageProps> = (props) => {
  const { resizeMode = 'cover', ...restProps } = props

  return <FastImage resizeMode={resizeMode} {...restProps} />
}

export type ImageProps = FastImageProps

export default Image
