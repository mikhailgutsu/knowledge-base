import { all } from 'redux-saga/effects'
import authStateSaga from './authState/saga/saga'
import netInfoSaga from './internetState/saga/saga'
import themeStateSaga from './themeState/saga/saga'

export default function* rootSaga() {
  yield all([...netInfoSaga, ...themeStateSaga, ...authStateSaga])
}
