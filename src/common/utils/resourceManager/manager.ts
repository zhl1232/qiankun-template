import _ from 'lodash-es'
import { fetchResourcesByType, CancelAbleFunc } from './fetchResource'
import { Resource } from './types'
import { ResourceType, DefaultResourceKeys } from './const'
import { extendDataByType } from './extendData'
import { ApiResponse } from '@/api'

interface ResourceRec {
  keys: string[]
  data: Resource[]
}

export interface ResourceCond {
  keys?: string[]
  size?: number
  offset?: number
  search?: string | any
  order?: <T>(a: T) => T
}

interface ComplexSearchCond {
  fields?: string[]
  pattern: string
  fieldSet?: Set<string>
}

export type SearchCond = ComplexSearchCond | ComplexSearchCond[] | string

const rec: Record<string, ResourceRec> = {}

const runningPs = {}
// 在进入microtask前执行callback
const requestAndCancelLast = (func: CancelAbleFunc, hash: string, saveData: (a: any) => any) => {
  runningPs?.[hash]?.req.cancel?.(`有新的${hash}更新请求`)
  _.set(runningPs, [hash, 'req'], func)
  return func()
    .then((data: ApiResponse) => {
      if (data.OPT_STATUS !== 'REQUEST_CANCELED') {
        const ans = saveData(data.DATA)
        const p = runningPs[hash]
        if (p.waitingResolvers) {
          p.waitingResolvers.forEach((f: (a: any) => any) => f(data.DATA))
        }
        delete runningPs[hash]
        return ans
      } else {
        return new Promise((resolve, reject) => {
          const p = runningPs[hash]
          if (!p.waitingResolvers) {
            p.waitingResolvers = []
            p.waitingRejects = []
          }
          p.waitingResolvers.push(resolve)
          p.waitingRejects.push(reject)
        })
      }
    })
    .catch(e => {
      const p = runningPs[hash]
      if (p.waitingRejects) {
        p.waitingRejects.forEach((f: (a: any) => any) => f(e))
      }
      throw e
    })
}

const isRunningPs = (hash: string) => {
  return hash in runningPs
}

const hash = type => {
  return `获取资源${type}`
}

/**
 * 重新获取资源。其中neededKeys会在fetchResources中经过对应的解析，找出对应的需要底层的字段，和对应的需要extends的字段
 */
export const updateResource = (type: ResourceType, neededKeys?: string[]) => {
  if (!neededKeys || neededKeys.length === 0) {
    neededKeys = DefaultResourceKeys[type]
  }
  neededKeys = neededKeys.map(key => key.toUpperCase())
  const storedKeys = _.get(rec, [type, 'keys'], [])
  // 必定携带id
  const keysToUpdate = _.union(neededKeys, storedKeys, ['id'])
  // 此处需要在发起请求前设置，能在被cancel后依然请求需要的字段
  _.set(rec, [type, 'keys'], keysToUpdate)
  // 检查是否已经有获取的数据
  if (keysToUpdate.length === storedKeys.length && !isRunningPs(hash(type))) {
    return Promise.resolve(rec?.[type]?.data)
  }
  const extendData = extendDataByType(type, keysToUpdate)
  const r = requestAndCancelLast(fetchResourcesByType(type)(keysToUpdate), hash(type), (data: Resource[]) => {
    data = extendData(data)
    _.set(rec, [type], {
      data,
      keys: keysToUpdate,
      idMap: _.keyBy(data, 'ID')
    })
    return data
  })
  return r
}

/**
 * target: 搜索目标，可以是一个字符串或者一个结构体，字符串会进行全局搜索
 * 结构体形式: [{
 *  fields: [搜索列],
 *  pattern: '搜索的目标字符串，目前只支持包含关系'
 * }]
 */
const search = (data: any[]) => (target: SearchCond) => {
  let conds: ComplexSearchCond[]
  if (typeof target === 'string') {
    conds = [
      {
        pattern: target,
        fields: [] // 空数组表示全部
      }
    ]
  } else if (target instanceof Array) {
    conds = target
  } else {
    conds = [target]
  }
  _.forEach(conds, cond => {
    if (!cond.fields) {
      cond.fields = []
    }
    cond.fieldSet = new Set(cond.fields)
  })
  const ans = []
  _.forEach(data, d => {
    _.forEach(d, (v, k) => {
      if (typeof v !== 'string') {
        return
      }
      let checked = false
      _.forEach(conds, cond => {
        if (cond.fieldSet.size === 0 || cond.fieldSet.has(k)) {
          if (v.indexOf(cond.pattern) > -1) {
            checked = true
            return false
          }
        }
      })
      if (checked) {
        ans.push(d)
        return false
      }
    })
  })
  return ans
}

/*
 * 不需要考虑按keys返回了，因为组件上显示的数据都是有限的,返回的数据是所有所需字段的并集
 * 搜索从指定的字段中进行搜索
 */
export const fetchResource = (type: ResourceType, config: ResourceCond = { size: 50, offset: 0 }) => {
  const rs = _.get(rec, type)
  if (!rs) {
    return []
  }
  let data = rs.data
  if (config.search) {
    data = search(data)(config.search)
  }
  if (config.order) {
    data = config.order(data)
  }
  const size = config.size || 50
  const offset = config.offset || 0
  return _.cloneDeep(_.slice(data, offset * size, (offset + 1) * size))
}

export const loadAllResources: () => Promise<Resource[][]> = () =>
  Promise.all([updateResource(ResourceType.vm, ['label', 'id', 'epc_name'])])

/**
 * 对外暴露的常用接口，完成(可能需要的)资源更新、数据获取两个动作
 */
export const getResources = (type: ResourceType, cond: ResourceCond = {}) => {
  return updateResource(type, cond.keys).then(() => fetchResource(type, cond))
}

export const getResourceById = (type: ResourceType, id: string | number) => {
  return _.get(rec, [type, 'idMap', id], null)
}
