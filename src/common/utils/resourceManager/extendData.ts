import _ from 'lodash-es'
import { Vm, Resource } from './types'
import { VM_STATE_MAP, HOST_STATE_MAP } from '@/const'
import { ResourceType } from './const'

/**
 *  本模块用于对API字段进行extend
 *  注意，这些extend都在原地进行。由于manager中做了数据复用，保证任何时候，只有一份对应的资源数据。
 *  每指定一个extend字段，需要指定需要的后端字段，在API获取时会自动转换添加必须的字段
 *  extend 函数需要完成对数据的本地操作
 */

export const extendDataByType: (a: ResourceType, keys: string[]) => (a: Resource[]) => Resource[] = (
  type: ResourceType,
  neededKeys: string[]
) => {
  if (type in resourceExtendFuncs) {
    return (data: Resource[]) => extendData(data, neededKeys, resourceExtendFuncs[type])
  }
  return extendDefault
}

interface ExtendConfig {
  extend: (a: Resource) => any
  requiredKeys: string[]
}

const extendDefault = (data: any) => {
  return data
}

const extendData = (ds: Resource[], neededKeys: string[], extendConfigs: Record<string, ExtendConfig>) => {
  if (ds.length === 0) {
    return ds
  }
  const firstItem = ds[0]
  const missingKeys = []
  const keySet = new Set(neededKeys)
  _.forEach(extendConfigs, (config, newKey) => {
    // 已经被扩展过
    if (newKey in firstItem || !keySet.has(newKey)) {
      return
    }
    _.forEach(config.requiredKeys, key => {
      if (!(key in firstItem)) {
        missingKeys.push(key)
      }
    })
    if (missingKeys.length) {
      throw Error(`如下扩展依赖字段在原数据中不存在: ${missingKeys}`)
    }
    ds.forEach(config.extend)
  })
  return ds
}

/**
 * 每个需要扩展的字段，提供对应的依赖字段列表，和extend函数
 * 依赖扩展字段会在往后端请求时进行转换
 * 注意extend是原地修改的且需要是幂等的
 */
const vmExtendFuncs: Record<string, ExtendConfig> = {
  EXTEND_STATE: {
    requiredKeys: ['STATE'],
    extend: (vm: Vm) => (vm.EXTEND_STATE = _.get(VM_STATE_MAP, vm.STATE, '其他'))
  },
  EXTEND_DOMAIN_NAME: {
    requiredKeys: ['DOMAIN_NAME'],
    extend: (vm: Vm) => (vm.EXTEND_DOMAIN_NAME = _.get(vm, ['DOMAIN_NAME'], '--'))
  }
}

const resourceExtendFuncs: Record<ResourceType, Record<string, ExtendConfig>> = {
  vm: vmExtendFuncs,
  host: {
    EXTEND_STATE: {
      extend: (host: Resource) => (host.EXTEND_STATE = _.get(HOST_STATE_MAP, host.STATE, '其他')),
      requiredKeys: ['STATE']
    },
    EXTEND_NAME: {
      extend: (host: Resource) => (host.EXTEND_NAME = `${host.NAME}(${host.DOMAIN_NAME || '--'})`),
      requiredKeys: ['NAME', 'DOMAIN_NAME']
    },
    EXTEND_TYPE: {
      extend: (host: Resource) => {
        if (host.HTYPE === 3 && host.TYPE === 1) {
          host.EXTEND_TYPE = 'KVM计算节点'
        } else if (host.TYPE === 3 && host.TYPE === 3) {
          host.EXTEND_TYPE = '网络节点'
        } else if (host.HTYPE === 2) {
          host.EXTEND_TYPE = 'ESXi计算节点'
        } else {
          host.EXTEND_TYPE = '--'
        }
      },
      requiredKeys: ['HTYPE', 'TYPE']
    }
  }
}

/**
 *  将待查询的字段转换为底层需要返回的字段
 */
export const getRequiredKeys = (type: ResourceType, keys: string[]) => {
  const upperKeys = keys.map(key => key.toUpperCase())
  const neededKeys: Set<string> = new Set()
  const extendFuncs = resourceExtendFuncs[type]
  _.forEach(upperKeys, key => {
    if (key in extendFuncs) {
      extendFuncs[key].requiredKeys.forEach((rk: string) => {
        neededKeys.add(rk)
      })
    } else {
      neededKeys.add(key)
    }
  })
  return Array.from(neededKeys).map(k => k.toLowerCase())
}
