import React from 'react'

import { useSelector } from 'react-redux'
import { getStorageItem } from '@storage'
import { useAppStateStatus } from '@hooks'
import { useNavigation } from '@react-navigation/native'
import { selectGalleryState } from '@store/galleryOpen/galleryOpen.selectors'

import type { LoggedInHomeStackParamList } from '@navigation/stacks/logged-in/logged-in.types'

const useAppResumeSinginPincode = () => {
  const navigation = useNavigation<LoggedInHomeStackParamList['navigation']>()

  const isGalleryOpen = useSelector(selectGalleryState)

  const { appStateStatus, previousAppStateStatus } = useAppStateStatus()

  React.useEffect(() => {
    const checkPinRequirement = async () => {
      const portStorage = await getStorageItem<string>('port')

      if (previousAppStateStatus !== appStateStatus) {
        if (isGalleryOpen || portStorage) {
          console.log('Skipping PIN screen due to gallery being open')
          return
        }

        navigation.navigate('HOME', {
          screen: 'Pin',
          params: { isNewPin: false },
        })
      }
    }
    checkPinRequirement()
  }, [appStateStatus, previousAppStateStatus, navigation])

  return null
}

export default useAppResumeSinginPincode
