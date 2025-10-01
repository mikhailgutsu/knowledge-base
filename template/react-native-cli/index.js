// -----------------------------------------------------------------------------
// Polyfill for international pluralization rules.
// Some i18n libraries (like i18next) rely on Intl.PluralRules to determine 
// correct plural forms ("1 item" vs "2 items"). Older Android/iOS runtimes may 
// not support this API out of the box, so we polyfill it here.
// -----------------------------------------------------------------------------
import 'intl-pluralrules'


// -----------------------------------------------------------------------------
// Import React Native Reanimated. 
// MUST be one of the very first imports in the entry file.
// Why? Because Reanimated patches the global JS runtime and Babel plugin 
// generates "worklets". If it's not imported first, animations and gesture 
// handlers may break at runtime.
// -----------------------------------------------------------------------------
import 'react-native-reanimated'

// -----------------------------------------------------------------------------
// Import React Native Gesture Handler.
// Like Reanimated, this must be imported before other RN code so that the 
// gesture handler is properly initialized. Required for touch/gesture support 
// in many libraries (e.g. navigators, sliders).
// -----------------------------------------------------------------------------
import 'react-native-gesture-handler'

import { AppRegistry } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import { getStorageItem, setStorageItem } from '@storage'

// -----------------------------------------------------------------------------
// Import the background message handler for Firebase Cloud Messaging (FCM).
// This ensures that even if the app is killed or running in the background, 
// push messages (notifications, VoIP calls, etc.) are handled correctly.
// The handler is registered globally, outside the React component tree.
// -----------------------------------------------------------------------------
import '@firebase/video-streaming-notifications/helpers/firebase/backgroundMessageHandler'

// -----------------------------------------------------------------------------
// Import centralized environment configuration (from react-native-config).
// Contains sensitive or dynamic values like API base URLs, tokens, keys.
// -----------------------------------------------------------------------------
import env from '@env'

import axios from 'axios'
import store from '@store/store'
import { Provider as ReduxProvider } from 'react-redux'

import App from './App'

import { name as appName } from './app.json'

import { OS } from 'src/constants'
import { EVENT_CALL_DENIED, EVENT_CALL_MISSED } from '@endpoints'

// -----------------------------------------------------------------------------
// Configure Reactotron only in development builds.
// `__DEV__` is a global constant set by Metro bundler.
// Dynamic import ensures Reactotron code is excluded from production bundle.
// -----------------------------------------------------------------------------
if (__DEV__) {
  import('./ReactotronConfig')
    .then(() => console.info('Reactotron Configured'))
    .catch((error) => console.error('Reactotron Config Error:', error))
}

// -----------------------------------------------------------------------------
// On iOS, React Native apps can be launched in "headless" mode (no UI) when 
// triggered by background tasks like push notifications or background fetch. 
// In those cases we must NOT render the UI, otherwise iOS may kill the app.
// This check ensures we safely skip rendering if running headless.
// -----------------------------------------------------------------------------
if (OS === 'ios') {
  messaging()
    .getIsHeadless()
    .then((isHeadless) => {
      if (isHeadless) {
        return null
      }
    })
}

// -----------------------------------------------------------------------------
// RootApp wraps the entire App component in ReduxProvider.
// This makes the Redux store available to all components via hooks (useSelector, 
// useDispatch). Any screen can now read or modify global state.
// -----------------------------------------------------------------------------
const RootApp = () => {
  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  )
}

// -----------------------------------------------------------------------------
// Headless background task handler.
// This function is called when the OS wakes the app to process a background 
// "CallEvent". It receives an object with call status and serial number, then:
//   1. Retrieves the user’s stored token from AsyncStorage.
//   2. Calls the backend API to report the missed/declined call.
//   3. Uses Axios for HTTP requests with proper Authorization header.
//   4. Resolves a Promise to let RN know the task finished.
// -----------------------------------------------------------------------------
const handleCallEvent = async (data) => {
  const { status, serialNumber } = data

  const userToken = await getStorageItem(env.USER_TOKEN)

  const sendCallEvent = async (eventType) => {
    if (!!userToken) {
      try {
        const response = await axios.post(
          `${env.API}${eventType}`,
          { serialNumber },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )

        if (response.status === 200) {
          console.log('Success:', response.data)
        }
      } catch (error) {
        console.error(`Error sending ${eventType} event:`, error)
      }
    }
  }

  if (status === 'MISSED') {
    await sendCallEvent(EVENT_CALL_MISSED)
  } else if (status === 'DECLINED') {
    await sendCallEvent(EVENT_CALL_DENIED)
  }

  return Promise.resolve()
}

// -----------------------------------------------------------------------------
// Register the root component with the app name (from app.json).
// This tells React Native which component to render when the app starts.
//
// Also register the headless task handler for "CallEvent" background jobs 
// so the app can process them even when not running in foreground.
// -----------------------------------------------------------------------------
AppRegistry.registerComponent(appName, () => RootApp)
AppRegistry.registerHeadlessTask('CallEvent', () => handleCallEvent)
