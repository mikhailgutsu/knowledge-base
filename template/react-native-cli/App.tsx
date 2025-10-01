import React from 'react'

// -----------------------------------------------------------------------------
// Firebase Cloud Messaging for React Native.
// Provides APIs to handle push notifications (foreground, background, token updates).
// -----------------------------------------------------------------------------
import messaging from '@react-native-firebase/messaging'

// -----------------------------------------------------------------------------
// ToastProvider: global toast notifications (popups) for success/error/info messages.
// Wraps the app to allow showing toast messages anywhere in the component tree.
// -----------------------------------------------------------------------------
import { ToastProvider } from 'react-native-toast-notifications'

// -----------------------------------------------------------------------------
// SafeAreaProvider ensures that content respects safe area insets (notches, 
// status bars, home indicators) on iOS and Android devices.
// Needed as the top-level provider to make `useSafeAreaInsets` and safe-area 
// aware components work properly.
// -----------------------------------------------------------------------------
import { SafeAreaProvider } from 'react-native-safe-area-context'

// -----------------------------------------------------------------------------
// i18n (internationalization) configuration.
// Contains language files, pluralization, and translation setup for multiple locales.
// -----------------------------------------------------------------------------
import i18n from '@translations/config'
import { I18nextProvider } from 'react-i18next'
// Provider that makes i18n instance available throughout the app.

// -----------------------------------------------------------------------------
// Restyle ThemeProvider: provides theming support (colors, spacing, typography).
// `theme` is defined in your design system. Theme mode (light/dark) is dynamic.
// -----------------------------------------------------------------------------
import { theme } from '@theme/index'
import { ThemeProvider } from '@shopify/restyle'

// -----------------------------------------------------------------------------
// React-use: `useMount` is a lifecycle hook that runs once on component mount.
// Similar to useEffect(..., []), but cleaner for "run on mount" logic.
// -----------------------------------------------------------------------------
import { useMount } from 'react-use'

// -----------------------------------------------------------------------------
// Redux hooks for accessing global state.
// `useSelector` reads state slices (e.g., theme mode).
// -----------------------------------------------------------------------------
import { useSelector } from 'react-redux'

// -----------------------------------------------------------------------------
// Custom hook for tracking app state (foreground, background, inactive).
// Useful to trigger permissions only when app is active.
// -----------------------------------------------------------------------------
import { useAppStateStatus } from '@hooks'

// -----------------------------------------------------------------------------
// Helper function to request necessary application permissions 
// (push notifications, camera, microphone, etc.) when app is active.
// -----------------------------------------------------------------------------
import { requestApplicationPermissions } from '@helpers/index'

// -----------------------------------------------------------------------------
// Firebase Video Streaming Notifications helpers.
// Provide functions for updating FCM tokens and handling foreground messages.
// -----------------------------------------------------------------------------
import * as FIREBASE_VSN_HELPERS from '@firebase/video-streaming-notifications/helpers'

// -----------------------------------------------------------------------------
// CoreNavigation: main navigation container of the app.
// Handles stack navigators, tabs, and routing logic for screens.
// -----------------------------------------------------------------------------
import CoreNavigation from '@navigation/Core.navigation'

// -----------------------------------------------------------------------------
// RootState type for Redux store.
// Used to strongly type `useSelector` calls.
// -----------------------------------------------------------------------------
import type { RootState } from '@store/store.types'

// -----------------------------------------------------------------------------
// App component: top-level React component for the application.
// Wraps everything in providers for safe area, i18n, theming, and toasts.
// -----------------------------------------------------------------------------
const App: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Get current theme mode from Redux store (light, dark, etc.)
  // State slice: themeState.themeMode
  // This determines which theme object to provide to Restyle.
  // ---------------------------------------------------------------------------
  const { themeMode } = useSelector(({ themeState }: RootState) => themeState)

  // ---------------------------------------------------------------------------
  // Get current app lifecycle state (foreground/background).
  // Useful for deciding when to request permissions or handle token refresh.
  // ---------------------------------------------------------------------------
  const { appStateStatus } = useAppStateStatus()

  // ---------------------------------------------------------------------------
  // Run once on component mount:
  // - If app is active, request permissions.
  // - Subscribe to FCM token refresh → update token in backend.
  // - Subscribe to foreground push messages → handle them gracefully.
  // - Cleanup: unsubscribe from listeners on unmount.
  // ---------------------------------------------------------------------------
  useMount(async () => {
    if (appStateStatus === 'active') {
      await requestApplicationPermissions()
    }

    // Subscribe to FCM token refresh (fires when Firebase rotates the device token).
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      FIREBASE_VSN_HELPERS.updateFCMToken
    )

    // Subscribe to foreground push notifications (while app is open).
    const unsubscribeForeground = messaging().onMessage(
      FIREBASE_VSN_HELPERS.foregroundMessageHandler
    )

    // Cleanup both subscriptions on unmount
    return () => {
      unsubscribeTokenRefresh()
      unsubscribeForeground()
    }
  })
  
  // ---------------------------------------------------------------------------
  // Render the app with all required providers in correct order:
  // 1. SafeAreaProvider → ensures layout respects notches/status bars
  // 2. I18nextProvider → enables translations globally
  // 3. ThemeProvider → injects dynamic theme based on Redux state
  // 4. ToastProvider → enables toast notifications anywhere in app
  // 5. CoreNavigation → renders navigators and screens
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme[themeMode]}>
          <ToastProvider placement="top" offsetTop={0} animationType="slide-in">
            <CoreNavigation />
          </ToastProvider>
        </ThemeProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  )
}

export default App
