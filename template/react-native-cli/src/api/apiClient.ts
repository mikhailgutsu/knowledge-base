import axios from 'axios'

import env from '@env'

const apiClient = axios.create({
  baseURL: env.API,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (config) => {
  return config
})

export default apiClient
