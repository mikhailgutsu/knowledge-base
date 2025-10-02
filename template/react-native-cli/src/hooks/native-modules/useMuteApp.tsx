import React from 'react'
import { t } from 'i18next'

import { showAlert } from '@helpers/index'
import { getStorageItem, setStorageItem } from '@storage'
import { muteApp } from '@firebase/video-streaming-notifications/helpers'

const useMuteApp = () => {
  const [isMuteApp, setIsMuteApp] = React.useState<boolean>(false)

  React.useEffect(() => {
    const getMuteState = async () => {
      const muteState = await getStorageItem<boolean>('muteApp')
      const effectiveMuteState = muteState ?? false

      setIsMuteApp(effectiveMuteState)

      if (muteState === null) {
        setStorageItem('muteApp', effectiveMuteState)
      }

      muteApp(effectiveMuteState)
    }

    getMuteState()
  }, [isMuteApp])

  const toggleMuteApp = (value: boolean | ((prevState: boolean) => boolean)) => {
    showAlert({
      cancelable: true,
      cancelText: t('actions.cancel'),
      title: isMuteApp ? t('dashBoard.unmute') : t('dashBoard.mute'),
      onPressText: isMuteApp ? t('dashBoard.unmute') : t('dashBoard.mute'),
      message: isMuteApp ? t('dashBoard.unmute_app') : t('dashBoard.mute_app'),
      onPress: async () => {
        setIsMuteApp(value)
        setStorageItem('muteApp', value)
      },
    })
  }

  return { isMuteApp, toggleMuteApp }
}

export default useMuteApp
