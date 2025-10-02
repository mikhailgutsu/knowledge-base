import rootSaga from './store.saga'
import createSagaMiddleware from 'redux-saga'
import Reactotron from '../../ReactotronConfig'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import authReducer from './authState/authState.reducer'
import themeReducer from './themeState/themeState.reducer'
import currentUserReducer from './currentUser/currentUser.reducer'
import internetReducer from './internetState/internetState.reducer'
import currentGalleryReducer from './galleryOpen/galleryOpen.reducer'

const reducersCombined = combineReducers({
  // Global states
  authState: authReducer, // isAuthenticated - (true | false)

  themeState: themeReducer, // themeMode - (light | dark)

  internetState: internetReducer, // isConnected - (true | false)

  // User data
  currentUser: currentUserReducer,

  // Gallery sate
  galleryState: currentGalleryReducer,
})

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: reducersCombined,

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ thunk: false }).concat([sagaMiddleware])
  },

  enhancers: (getDefaultEnhancers) =>
    __DEV__
      ? getDefaultEnhancers().concat((Reactotron as any).createEnhancer())
      : getDefaultEnhancers(),

  devTools: __DEV__,
})

sagaMiddleware.run(rootSaga)

store.dispatch({ type: 'INIT' })

export default store
