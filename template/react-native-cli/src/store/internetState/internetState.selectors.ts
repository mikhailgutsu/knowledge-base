import { RootState } from '../store.types'

export const selectInternetState = (state: RootState) => state.internetState.isConnected
