import type { AxiosRequestConfig, AxiosResponse } from 'axios'

type RequestMethod = 'post' | 'get' | 'head' | 'put' | 'patch' | 'delete'

type RequestConfig = Omit<AxiosRequestConfig, 'data' | 'status'>

type RequestResponse<
  T extends object,
  K extends 'promise' | undefined = 'promise'
> = K extends 'promise'
  ? Promise<
      | {
          data: AxiosResponse<T, any>['data']
          status: AxiosResponse<T, number>['status']
        }
      | undefined
    >
  : {
      data: AxiosResponse<T, any>['data']
      status: AxiosResponse<T, number>['status']
    }

type Call<T extends object> = (
  payload?: AxiosRequestConfig['data'],
  successfulCB?: (response: RequestResponse<T, undefined>) => void,
  config?: RequestConfig & { additionalUrl?: string }
) => RequestResponse<T>

type UseAxiosRequestUtilities = {
  loading: boolean
  cancel: () => void
  error: object | undefined
  isSuccessfulRequest: boolean
}

type UseAxiosRequestReturn<T extends object = any> = [Call<T>, UseAxiosRequestUtilities]

export type { Call, RequestMethod, UseAxiosRequestReturn, RequestConfig }
