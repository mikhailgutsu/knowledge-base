import React from 'react'

import api from '@api/apiClient'

import { useToast } from 'react-native-toast-notifications'

import type { RequestMethod, UseAxiosRequestReturn } from './types'

const ERROR_HANDLERS = {
  BASE: (message: string) => message,
}

const useAxiosRequest = <T extends object = any>(
  url: string,
  method: RequestMethod = 'get',
  shoutError = true,
  errHandler: keyof typeof ERROR_HANDLERS = 'BASE'
) => {
  const toast = useToast()

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<object | undefined>(undefined)

  const controllerRef = React.useRef(new AbortController())

  const cancel = React.useCallback(() => controllerRef.current.abort(), [controllerRef])

  const call = React.useCallback<UseAxiosRequestReturn<T>['0']>(
    async (...args) => {
      try {
        setLoading(true)

        const response = await api.request<T>({
          url: args[2]?.additionalUrl ? url + args[2].additionalUrl : url,
          method,
          data: args[0],
          signal: controllerRef.current.signal,
          ...args[2],
        })

        if ((response.status >= 200 && response.status <= 210) || response.data) {
          if (args[1]) {
            args[1]({ data: response.data, status: response.status })
          }

          return {
            data: response.data,
            status: response.status,
          }
        }
      } catch (err: any) {
        setError(err.response?.data || err)

        const responseError = err.response?.data?.message?.trim()
        const serverError = err.response?.data?.error?.trim()

        const errorMessage = responseError || serverError
        const errorDetails = err.response?.data?.details

        if (errorMessage && shoutError) {
          const message = ERROR_HANDLERS[errHandler](errorMessage)

          toast.show(message, { type: 'danger' })
        }

        if (errorDetails && Object.keys(errorDetails).length > 0 && shoutError) {
          Object.entries(errorDetails).forEach(([_, value]) => {
            const details = ERROR_HANDLERS[errHandler](value as string)

            toast.show(details, { type: 'danger' })
          })
        }

        return {
          data: err.response?.data,
          status: err.response?.status,
        }
      } finally {
        setLoading(false)
      }
    },
    [url, method, shoutError, errHandler]
  )

  const memoized = React.useMemo<UseAxiosRequestReturn<T>>(() => {
    return [call, { cancel, loading, error, isSuccessfulRequest: !loading && !error }]
  }, [error, loading, cancel, call])

  return memoized
}

export default useAxiosRequest
