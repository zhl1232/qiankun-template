import request, { ApiResponse } from '@/api'

import { ResourceApi, DefaultResourceKeys, ResourceType } from './const'

import { getRequiredKeys } from './extendData'

export interface CancelAbleFunc {
  (): Promise<ApiResponse>
  cancel?: (...args: any[]) => any
}

const createCancelAbleRequest = (url: string, params: any, ...args: any[]) => {
  const cancelToken = request.CancelToken.source()
  params.cancelToken = cancelToken.token
  const r: CancelAbleFunc = () => request(url, params, ...args)
  r.cancel = (msg: string) => cancelToken.cancel(msg)
  return r
}

export const fetchResourcesByType: (a: ResourceType) => (b: string[]) => CancelAbleFunc =
  (type: ResourceType) => (keys?: string[]) => {
    if (!keys || keys.length === 0) {
      keys = DefaultResourceKeys[type]
    }
    const getResource = createCancelAbleRequest(ResourceApi[type], {
      urlQuery: { field: getRequiredKeys(type, keys) }
    })
    return getResource
  }
