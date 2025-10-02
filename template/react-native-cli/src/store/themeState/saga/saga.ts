import { takeLatest } from 'redux-saga/effects'
import { loadThemeSaga } from './themeStateChanges'

export default [takeLatest('INIT', loadThemeSaga)]
