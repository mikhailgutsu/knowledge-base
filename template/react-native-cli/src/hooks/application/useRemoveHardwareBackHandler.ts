import React from 'react'
import ReactNative from 'react-native'

interface IUseRemoveHardwareBackHandlerProps {
  type?: boolean
}

const useRemoveHardwareBackHandler = (props: IUseRemoveHardwareBackHandlerProps) => {
  const { type = true } = props

  const isHardwareBack = React.useMemo(() => {
    return type === true
  }, [type])

  React.useEffect(() => {
    const subscribeBackHandler = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      () => isHardwareBack
    )

    return () => {
      subscribeBackHandler.remove()
    }
  }, [isHardwareBack])

  return {
    isHardwareBack,
  }
}

export default useRemoveHardwareBackHandler
