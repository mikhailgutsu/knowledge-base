import React from 'react'

import { getStorageItem, setStorageItem } from '@storage'
import { muteDevice } from '@firebase/video-streaming-notifications/helpers'

const useMuteDevice = (serialNumber: string) => {
  const [isMuteDevice, setIsMuteDevice] = React.useState<boolean>(false)

  React.useEffect(() => {
    const getMuteState = async () => {
      const muteState = await getStorageItem<boolean>(`deviceIsMuted${serialNumber}`)

      const effectiveMuteState = muteState ?? false

      setIsMuteDevice(effectiveMuteState)

      if (muteState === null) {
        setStorageItem(`deviceIsMuted${serialNumber}`, effectiveMuteState)
      }

      muteDevice(serialNumber, effectiveMuteState)
    }

    getMuteState()
  }, [isMuteDevice])

  const toggleMuteDevice = (value: boolean | ((prevState: boolean) => boolean)) => {
    setIsMuteDevice(value)
    setStorageItem(`deviceIsMuted${serialNumber}`, value)
  }

  return { isMuteDevice, toggleMuteDevice }
}

export default useMuteDevice
