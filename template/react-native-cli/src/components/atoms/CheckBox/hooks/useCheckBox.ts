import React from 'react'

import { useUpdateEffect } from 'react-use'

import type { Theme } from '@theme/index'

interface IUseCheckBoxProps {
  defaultChecked?: boolean
  defaultColor?: keyof Theme['colors']
}

const useCheckBox = (checkBoxProps: IUseCheckBoxProps) => {
  const { defaultChecked } = checkBoxProps

  const [isChecked, setIsChecked] = React.useState(defaultChecked)

  useUpdateEffect(() => {
    setIsChecked(defaultChecked)
  }, [defaultChecked])

  return {
    isChecked,
    setIsChecked,
  }
}

export default useCheckBox
