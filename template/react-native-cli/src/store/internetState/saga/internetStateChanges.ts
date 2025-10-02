import { call, put, take } from 'redux-saga/effects'
import { eventChannel, type EventChannel } from 'redux-saga'
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo'

import { internetStateChanged } from '../internetState.actions'

export function* handleNetInfoStateChange() {
  const netInfoChannel: EventChannel<NetInfoState> = yield call(createNetInfoChannel)

  try {
    while (true) {
      const netInfoState: NetInfoState = yield take(netInfoChannel)

      const isConnected = netInfoState.isConnected ?? false

      yield put(internetStateChanged(isConnected))
    }
  } catch (error) {
    console.error('error NetInfo:', error)
  } finally {
    netInfoChannel.close()
  }
}

function createNetInfoChannel(): EventChannel<NetInfoState> {
  return eventChannel<NetInfoState>((emitter) => {
    const handleNetInfoChange = (state: NetInfoState) => {
      emitter(state)
    }

    NetInfo.fetch().then(handleNetInfoChange)

    const unsubscribe = NetInfo.addEventListener(handleNetInfoChange)

    return () => {
      unsubscribe()
    }
  })
}
