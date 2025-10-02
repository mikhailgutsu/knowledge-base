import React from 'react'
import { AppState, type AppStateStatus } from 'react-native'

const useAppStateStatus = () => {
  const [appStateStatus, setAppStateStatus] = React.useState<AppStateStatus>(
    AppState.currentState
  )
  const previousAppStateRef = React.useRef<AppStateStatus>(AppState.currentState)

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      previousAppStateRef.current = appStateStatus
      setAppStateStatus(nextAppState)
    }

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange)

    return () => appStateSubscription.remove()
  }, [appStateStatus])

  return { appStateStatus, previousAppStateStatus: previousAppStateRef.current }
}

export default useAppStateStatus
