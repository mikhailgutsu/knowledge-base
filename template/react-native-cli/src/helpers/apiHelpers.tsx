import axios from 'axios'

export const sendRequest = async (url: string, action: string): Promise<any> => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.log('Error:', error)
    throw error
  }
}

export const checkResponseData = async (
  setIsRequestAccepted: (accepted: boolean) => void,
  isRequestAccepted: boolean,
  url: string
): Promise<void> => {
  if (!isRequestAccepted) {
    try {
      const data = await sendRequest(url, 'Get Init Call')
      if (data.includes('REQUEST_ACCEPT')) {
        setIsRequestAccepted(true)
      }
    } catch (error) {
      console.log('Error checking response:', error)
    }
  }
}
