import { takeLatest } from 'redux-saga/effects'
import { loadAuthSaga } from './authStateChanges'

export default [takeLatest('INIT', loadAuthSaga)]
