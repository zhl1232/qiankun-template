/**
 * 新增资源类型在此处调整
 * 对应的值就是对应的API url
 */
export enum ResourceType {
  vm = 'vm',
  host = 'host'
}

export const ResourceApi = {
  vm: '/vms',
  host: '/hosts'
}

export const DefaultResourceKeys = {
  vm: ['id', 'uid', 'name'],
  host: ['id', 'uid']
}
