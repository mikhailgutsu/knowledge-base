import * as Keychain from 'react-native-keychain'
import { setStorageItem } from '@storage'

interface ICredentails {
  email: string
  password: string
}

export const loginAndOptionallySaveCredentials = async (credentails: ICredentails) => {
  const { email, password } = credentails

  try {
    await Keychain.setGenericPassword(email, password, { service: email })
    await setStorageItem<string>('services', email)
  } catch (error) {
    console.error('Error saving credentials:', error)
  }
}
