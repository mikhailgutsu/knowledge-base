import { getStorageItem, setStorageItem } from '@storage'
import { ringtoneSetter } from '@firebase/video-streaming-notifications/helpers'

import { DEFAULT_RINGTONE } from 'src/constants'

const useDefaultRingtone = () => {
  const getDefaultRingtone = async () => {
    const ringtoneStorage = await getStorageItem<string>('ringtone')

    if (!ringtoneStorage) {
      ringtoneSetter(DEFAULT_RINGTONE)
      setStorageItem('ringtone', DEFAULT_RINGTONE)
    }
  }

  return { getDefaultRingtone }
}

export default useDefaultRingtone
