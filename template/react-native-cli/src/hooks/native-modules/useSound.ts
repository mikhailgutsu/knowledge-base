import React from 'react'
import Sound from 'react-native-sound'
import NotificationSounds, {
  playSampleSound,
  stopSampleSound,
  type Sound as INotificationSound,
} from 'react-native-notification-sounds'

import { getStorageItem, setStorageItem } from '@storage'
import { type DrawerNavigationProp } from '@react-navigation/drawer'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ringtoneSetter } from '@firebase/video-streaming-notifications/helpers'

import { OS, PACKAGE_NAME_ANDROID, SOUND_RESOURCES_IOS } from 'src/constants'

import type { LoggedInStackParamList } from '@navigation/stacks/logged-in/logged-in.types'

const useSound = () => {
  const navigation = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const playingSoundRef = React.useRef<Sound | null>(null)

  const [sounds, setSounds] = React.useState<INotificationSound[]>([])
  const [playing, setPlaying] = React.useState<INotificationSound | null>(null)
  const [selected, setSelected] = React.useState<number | null>(null)
  const [currentRingtone, setCurrentRingtone] = React.useState<INotificationSound | null>(
    null
  )

  useFocusEffect(
    React.useCallback(() => {
      if (OS === 'ios') {
        Sound.setCategory('Playback')
        setSounds(SOUND_RESOURCES_IOS)
      }

      if (OS === 'android') {
        NotificationSounds.getNotifications('ringtone')
          .then(async (soundsList) => {
            const customRingtone: INotificationSound = {
              title: 'Default Ringtone',
              soundID: 'default_ringtone',
              url: `android.resource://${PACKAGE_NAME_ANDROID}/raw/intercom`,
            }
            setSounds([customRingtone, ...soundsList])
          })
          .catch(console.error)
      }
    }, [])
  )

  const loadSavedRingtone = async () => {
    const savedRingtone = await getStorageItem('ringtone')

    if (savedRingtone) {
      const ringtoneToSelect = sounds.find((sound) => sound.url === savedRingtone)

      if (ringtoneToSelect) {
        setCurrentRingtone(ringtoneToSelect)
      }
    } else {
      const defaultSound = OS === 'ios' ? 'intercom' : 'default_ringtone'
      const defaultRingtone = sounds.find((sound) => sound.soundID === defaultSound)

      if (defaultRingtone) {
        setCurrentRingtone(defaultRingtone)
      }
    }
  }

  React.useEffect(() => {
    if (sounds.length > 0) {
      loadSavedRingtone()
    }
  }, [sounds, loadSavedRingtone])

  const handlePlaySound = (sound: INotificationSound, index: number) => {
    if (OS === 'ios') {
      const { url, soundID } = sound
      Sound.setCategory('Playback', true)

      if (playingSoundRef.current) {
        playingSoundRef.current.stop()
        playingSoundRef.current.release()
        playingSoundRef.current = null

        if (playing?.soundID === soundID) {
          setPlaying(null)
          setSelected(null)
          return
        }
      }

      const soundCallback = (error: Error | null) => {
        if (error) return

        playingSoundRef.current = soundIOS

        soundIOS.play(() => {
          soundIOS.release()
          playingSoundRef.current = null
        })

        setPlaying(sound)
        setSelected(index)
      }

      const soundIOS = new Sound(url, Sound.MAIN_BUNDLE, soundCallback)
    }

    if (OS === 'android') {
      if (playing?.soundID === sound.soundID) {
        stopSampleSound()
        setPlaying(null)
        setSelected(null)
      } else {
        setPlaying(sound)
        setSelected(index)
        playSampleSound(sound)
      }
    }
  }

  const handlerToSaveRingtone = (ringtone: string | undefined) => {
    if (ringtone) {
      if (OS === 'ios') {
        const fileName = ringtone.split('/').pop()

        console.log(fileName)

        if (fileName && playingSoundRef.current) {
          playingSoundRef.current.stop()
          playingSoundRef.current.release()
          playingSoundRef.current = null

          ringtoneSetter(fileName)
          setStorageItem('ringtone', fileName)
        }
      }

      if (OS === 'android') {
        stopSampleSound()
        ringtoneSetter(ringtone)
        setStorageItem('ringtone', ringtone)
      }
    }

    setPlaying(null)
    setSelected(null)
    navigation.goBack()
  }

  const goBackHandler = () => {
    if (OS === 'ios' && playingSoundRef.current) {
      playingSoundRef.current.stop()
      playingSoundRef.current.release()
      playingSoundRef.current = null
    }

    if (OS === 'android') {
      stopSampleSound()
    }

    setPlaying(null)
    setSelected(null)
    navigation.goBack()
  }

  React.useEffect(() => {
    return () => {
      if (OS === 'ios' && playingSoundRef.current) {
        playingSoundRef.current.stop()
        playingSoundRef.current.release()
        playingSoundRef.current = null
      }
    }
  }, [])

  return {
    sounds,
    playing,
    selected,
    navigation,
    goBackHandler,
    currentRingtone,
    handlePlaySound,
    handlerToSaveRingtone,
  }
}

export type { INotificationSound }

export default useSound
