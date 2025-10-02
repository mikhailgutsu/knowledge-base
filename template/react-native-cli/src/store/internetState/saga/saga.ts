import { takeLatest } from 'redux-saga/effects'
import { handleNetInfoStateChange } from './internetStateChanges'

export default [takeLatest('INIT', handleNetInfoStateChange)]
