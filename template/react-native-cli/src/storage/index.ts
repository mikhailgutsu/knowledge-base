import AsyncStorage from '@react-native-async-storage/async-storage'

const getStorageItem = async <T = any>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return JSON.parse(value) as T
    }
    return null
  } catch (error) {
    console.error(`Error getting item ${key} from AsyncStorage:`, error)
    return null
  }
}

const setStorageItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    if (key && value !== null) {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    }
  } catch (error) {
    console.error(`Error setting item ${key} in AsyncStorage:`, error)
  }
}

const removeStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing item ${key} from AsyncStorage:`, error)
  }
}

const removeStorageItems = async (keys: string[]): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(keys)
  } catch (error) {
    console.error(`Error removing items ${keys} from AsyncStorage:`, error)
  }
}

export { getStorageItem, setStorageItem, removeStorageItem, removeStorageItems }
