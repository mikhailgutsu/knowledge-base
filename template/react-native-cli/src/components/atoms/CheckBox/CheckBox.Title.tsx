import React from 'react'

import { Text } from '@components/atoms'

interface ICheckBoxTitle
  extends React.ComponentProps<typeof Text>,
    React.PropsWithChildren {
  title?: string
}

const CheckBoxTitle: React.FC<ICheckBoxTitle> = (props) => {
  const { title, children, ...textProps } = props

  return (
    <Text variant="font14SemiBold" {...textProps} color="silverstone_to_steel">
      {title ?? children}
    </Text>
  )
}

export default CheckBoxTitle
