import React from 'react'
import BootSplash from 'react-native-bootsplash'

import { NavigationContainer } from '@react-navigation/native'
import { createNavigationContainerRef } from '@react-navigation/native'

import { useMount } from 'react-use'
import { useSelector } from 'react-redux'
import { selectInternetState } from '@store/internetState/internetState.selectors'

import SplashScreen from '@screens/logged-out/Splash'
import LoggedInStack from './stacks/logged-in/logged-in.stack'
import LoggedOutStack from './stacks/logged-out/logged-out.stack'

import { linking } from './linking'
import { NoInternetOverlay } from '@helpers/index'

import type { RootState } from '@store/store.types'

export const navigationRef = createNavigationContainerRef()

const CoreNavigation: React.FC = () => {
  const [isSplash, setIsSplash] = React.useState<boolean>(true)

  const routeNameRef = React.useRef<string | undefined>()
  const isInternet = useSelector(selectInternetState)

  useMount(() => {
    const checkNotificationOpen = async () => {
      if (linking) {
        setIsSplash(false)
        return
      }
      const timer = setTimeout(() => {
        setIsSplash(false)
      }, 3000)
      return () => clearTimeout(timer)
    }

    checkNotificationOpen()
  })

  const isAuthenticated = useSelector(
    (state: RootState) => state.authState.isAuthenticated
  )

  const onReady = () => {
    BootSplash.hide({ fade: true })
    routeNameRef.current = navigationRef?.getCurrentRoute()?.name
    console.log('onReady', routeNameRef.current)
  }

  const onStateChange = async () => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = navigationRef?.getCurrentRoute()?.name

    if (previousRouteName !== currentRouteName) {
      console.log('previousRouteName', previousRouteName)
      console.log('currentRouteName', currentRouteName)
    }

    routeNameRef.current = currentRouteName
  }

  const CoreStack = isAuthenticated ? <LoggedInStack /> : <LoggedOutStack />

  return (
    <NavigationContainer
      linking={linking}
      onReady={onReady}
      ref={navigationRef as never}
      onStateChange={onStateChange}
    >
      {!isInternet && <NoInternetOverlay />}
      {isSplash ? <SplashScreen /> : CoreStack}
    </NavigationContainer>
  )
}

export default CoreNavigation
