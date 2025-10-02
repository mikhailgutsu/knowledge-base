import { call, put } from 'redux-saga/effects'
import { saveAuthState } from '../authState.actions'
import { getStorageItem } from '@storage'

export function* loadAuthSaga() {
  try {
    const isAuthenticated: boolean = yield call(getStorageItem, 'isAuthenticated')
    yield put(saveAuthState(isAuthenticated || false))
  } catch (error) {
    console.error('Error loading authentication state:', error)
    yield put(saveAuthState(false))
  }
}
