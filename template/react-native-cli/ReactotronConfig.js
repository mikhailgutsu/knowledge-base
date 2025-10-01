import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { name } from './app.json'

if (__DEV__) {
  // 1. Configure Reactotron
  Reactotron.configure({ name })
    // 2. Hook into AsyncStorage so you can inspect storage in Reactotron desktop app
    .setAsyncStorageHandler(AsyncStorage)

    // 3. Add React Native plugins for debugging
    .useReactNative({
      // track AsyncStorage changes
      asyncStorage: true,
      networking: {
        // ignore RN internal debug requests
        ignoreUrls: /symbolicate/,
      },
    })
    // 4. Add Redux plugin for debugging state/actions
    .use(reactotronRedux())

    // 5. Connect to Reactotron desktop app (via WebSocket, default port 9090)
    .connect()

  // 6. Clear Reactotron timeline on every app reload (keeps logs clean)
  Reactotron.clear()

  // 7. Add console shortcut: you can now call console.tron.log()
  // and it will appear inside the Reactotron app
  console.tron = Reactotron
}

// Export configured Reactotron instance so you can import/use it elsewhere
export default Reactotron
