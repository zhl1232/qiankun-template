/* eslint-disable */
/**
 * 全量api
 */
import moment from 'moment'
import {
  numberToSigfig,
  numberToSigfigShort,
} from 'base/js/tool.js'
import API from './API'
import request from './index'
import {
  ALARM_LEVEL_MAP,
  APP_MAP,
  SUB_APP_MAP,
  APP_TYPE_VIEW,
  APP_TYPE_SYSTEM,
  CONTROLLER_ROLE_TYPE,
  CONTROLLER_STATE_MAP,
  DEVICE_TYPE_ROUTER,
  DEVICE_TYPE_VM,
  HOST_STATE_MAP,
  LOG_SEVERITY,
  LOG_SEVERITY_COLOR,
  LOG_TYPE,
  NPB_POLICY_DISABLED,
  NPB_POLICY_ENABLED,
  OBJECT_ID_DATA_CENTER,
  OBJECT_ID_WAN,
  OBJECT_TYPE_IP,
  OBJECT_TYPE_TEXT,
  OBJECT_TYPE_VPC,
  PLATFORM_TYPE,
  REPORT_TYPE_MAP,
  RESOURCE_ICON_DEFAULT,
  RESOURCE_ICON_INTERNET,
  RESOURCE_ID_INTERNET,
  RESOURCE_TYPE_DATA_CENTER,
  RESOURCE_TYPE_MAP,
  RESOURCE_TYPE_VM,
  TAP_TYPE_MAP,
  TRIGGER_CONDITION_MAP,
  TRIGGER_TYPE_ANALYZER_LOAD,
  TRIGGER_TYPE_ANALYZER_PACKAGE,
  TRIGGER_TYPE_CONTROLLER,
  TRIGGER_TYPE_VTAP_ANALAZY,
  TRIGGER_TYPE_VTAP_CPU,
  TRIGGER_TYPE_VTAP_FLOW,
  TRIGGER_TYPE_VTAP_MEMORY,
  TRIGGER_TYPE_VTAP_PACKAGE,
  TUNNEL_TYPE_MAP,
  USER_DELETED,
  USER_STATE_MAP,
  USER_TYPE_MAP,
  VM_STATE_MAP,
  VM_STATE_ID_ARR,
  NETWORK_ELEMENT_TYPE_MAP,
  TAP_TYPE_TYPE_MAP,
  iconTypeMap,
  INTERNET_ACCESS,
  PACKET,
  SUB_TYPE_MAP,
  TRIGGER_TYPE_UNIT_MAP,
  ALARM_DATA_LEVEL_MAP,
  INTERVAL_MAP,
  STATE_MAP,
  TSDB_TYPE_MAP,
  SYSTEM_TYPE_NAME_MAP,
  ALARM_CONTRAST_MAP,
  TRIGGER_TYPE_RESTART_PROCESS,
  TRIGGER_TYPE_DELETE_POLICY,
  ENDPOINT_PUSH_TYPE_MAP,
} from '../const'

/**
 * 资源组
 */
export class Resource extends API {
  extend(resources) {
    _.forEach(resources, resource => {
      resource.EXTEND_TYPE = RESOURCE_TYPE_MAP[resource.TYPE]
      if (resource.TYPE !== RESOURCE_TYPE_DATA_CENTER) {
        resource.EXTEND_RESOURCES =
          resource.TYPE === RESOURCE_TYPE_VM ? resource.VM_IDS : resource.IPS
      }
    })
    return resources
  }

  complex(resources) {
    const items = [] // 为了适配autocompletes
    const map = {};
    const mapByObjectId = {}
    _.forEach(resources, resource => {
      items.push({
        text: resource.NAME,
        value: resource.ID,
      })
      map[resource.ID] = resource
      mapByObjectId[resource.BUSINESS_ID] = mapByObjectId[resource.BUSINESS_ID] || []
      mapByObjectId[resource.BUSINESS_ID].push(resource)
    })
    return {
      origin: resources,
      map,
      items,
      mapByObjectId,
    }
  }

  // 字段翻译，依赖外部数据
  static interpret(resource, epcMap, vmMap, limit = 3) {
    if (resource.TYPE !== RESOURCE_TYPE_DATA_CENTER) {
      resource.INTERPRETED_EPC_NAME =
        _.get(epcMap, [resource.EPC_ID, 'EXTEND_NAME_WITH_ALIAS'], '')
      if (!resource.INTERPRETED_EPC_NAME && resource.EPC_ID) {
        resource.INTERPRETED_EPC_NAME = `已删除(ID=${resource.EPC_ID})`
      }
      resource.INTERPRETED_RESOURCES =
        resource.TYPE === RESOURCE_TYPE_VM
          ? _.map(resource.VM_IDS, id => _.get(vmMap, [id, 'EXTEND_NAME_WITH_ALIAS'], '未知资源组'))
            .join(',')
          : resource.IPS.join(',')
      resource.INTERPRETED_RESOURCES_TEXT =
        resource.TYPE === RESOURCE_TYPE_VM ?
          _.map(
            resource.VM_IDS.slice(0, limit),
            id => _.get(vmMap, [id, 'EXTEND_NAME_WITH_ALIAS'], '未知资源组')
          ).join(',') :
          resource.IPS.slice(0, limit).join(',')
      if (resource.EXTEND_RESOURCES.length > limit) {
        resource.INTERPRETED_RESOURCES_TEXT += '...'
      }
    }
    return resource
  }

  // interpret方法参数过多
  static addIcon(resource, iconMap) {
    const id =
      // eslint-disable-next-line
      resource.ID === RESOURCE_ID_INTERNET
        ? RESOURCE_ICON_INTERNET
        : (typeof resource.ICON_ID === 'number' ? resource.ICON_ID : RESOURCE_ICON_DEFAULT)
    resource.INTERPRETED_ICON =
      _.get(iconMap, [id, 'CONTENT'], _.get(iconMap, [RESOURCE_ICON_DEFAULT, 'CONTENT']))
    resource.INTERPRETED_ICON_NAME = _.get(iconMap, [id, 'NAME'])
  }
}

/**
 * 项目
 */
export class EPC extends API {
  extend(epcs) {
    _.forEach(epcs, epc => {
      epc.EXTEND_DOMAIN_NAME = _.get(epc, 'DOMAIN_NAME', '--')
      epc.EXTEND_NAME = (epc.DELETED ? epc.NAME + ' (已删除)' : epc.NAME)
      if (epc.EXTEND_DOMAIN_NAME && epc.EXTEND_DOMAIN_NAME !== '--') {
        epc.EXTEND_NAME += ' (' + epc.EXTEND_DOMAIN_NAME + ')'
      }
      epc.UNIQUE_NAME = `${epc.DELETED ? epc.NAME + ' (已删除)' : epc.NAME}`
        + `（${epc.EXTEND_DOMAIN_NAME}，${epc.REGION_NAME}）`
      epc.EXTEND_NAME_WITH_ALIAS = epc.EXTEND_NAME
    })
    return epcs
  }

  complex(epcs) {
    const items = [] // 为了适配autocompletes
    const vpcList = []
    const map = {}
    let mapByRegionId = {}
    let mapByDomainLcuuid = {}
    _.forEach(epcs, epc => {
      items.push({
        text: epc.NAME,
        value: epc.ID,
      })
      vpcList.push({
        text: epc.EXTEND_NAME,
        value: epc.ID
      })
      map[epc.ID] = epc
      mapByRegionId[epc.REGION] = mapByRegionId[epc.REGION] || []
      mapByRegionId[epc.REGION].push(epc)
      mapByDomainLcuuid[epc.DOMAIN] = mapByDomainLcuuid[epc.DOMAIN] || []
      mapByDomainLcuuid[epc.DOMAIN].push(epc)
    })
    return {
      origin: epcs,
      items,
      vpcList,
      map,
      mapByRegionId,
      mapByDomainLcuuid,
    }
  }

  static interpret(epc, vmMapByEpcId, subnetMapByEpcId, wanipMapByEpcId, userMap) {
    vmMapByEpcId && (epc.EXTEND_VM_NUM = _.get(vmMapByEpcId, [epc.ID], []).length)
    subnetMapByEpcId && (epc.EXTEND_SUBNET_NUM = _.get(subnetMapByEpcId, [epc.ID], []).length)
    wanipMapByEpcId && (epc.EXTEND_WANIP_NUM = _.get(wanipMapByEpcId, [epc.ID], []).length)
    if (userMap) {
      epc.INTERPRETED_USER_NAME = _.get(userMap, [epc.USERID, 'USERNAME'])
      epc.INTERPRETED_NAME = epc.NAME + `（${epc.INTERPRETED_USER_NAME}）`
    }
    return epc
  }
}

/**
 * IP
 */
class IP extends API {
}

class DBIP extends API {
  extend(ips) {
    _.forEach(ips, ip => {
      if (ip.NETMASK > 0 && ip.NETMASK < 32) {
        ip.EXTEND_IP_NETMASK = `${ip.IP}/${ip.NETMASK}`
      }
      ip.EXTEND_IP_NETMASK = ip.IP
      ip.EXTEND_NAME_WITH_ALIAS = ip.ALIAS ? `${ip.IP}(${ip.ALIAS})` : ip.IP
    })
    return ips
  }

  complex(ips) {
    const mapByEpcId = {}
    const map = {}
    _.forEach(ips, ip => {
      mapByEpcId[ip.EPC_ID] = mapByEpcId[ip.EPC_ID] || []
      mapByEpcId[ip.EPC_ID].push(ip)
      map[ip.IP] = ip
    })
    return {
      origin: ips,
      mapByEpcId,
      map,
    }
  }
}

export class WANIP extends API {
  extend(ips) {
    _.forEach(ips, ip => {
      if (ip.DEVICE_TYPE === DEVICE_TYPE_VM) {
        ip.EXTEND_DEVICE_NAME = '云服务器 (' + ip.DEVICE_NAME + ')'
      } else if (ip.DEVICE_TYPE === DEVICE_TYPE_ROUTER) {
        ip.EXTEND_DEVICE_NAME = '路由器 (' + ip.DEVICE_NAME + ')'
      } else {
        ip.EXTEND_DEVICE_NAME = '其他 (' + ip.DEVICE_NAME + ')'
      }
    })
    return ips
  }

  complex(ips) {
    const mapByEpcId = {}
    _.forEach(ips, ip => {
      mapByEpcId[ip.EPC_ID] = mapByEpcId[ip.EPC_ID] || []
      mapByEpcId[ip.EPC_ID].push(ip)
    })
    return {
      origin: ips,
      mapByEpcId,
    }
  }
}

/**
 * vm
 */
export class VM extends API {
  getSimple() {
    return request('/vms/simple').then(data => {
      return {
        map: _.reduce(data.DATA, (acc, item) => {
          item.EXTEND_NAME_WITH_ALIAS = item.NAME
          acc[item.ID] = item
          return acc
        }, {})
      }
    })
  }

  extend(vms) {
    _.forEach(vms, vm => {
      if (VM_STATE_ID_ARR.indexOf(vm.STATE) !== -1) {
        vm.EXTEND_STATE = VM_STATE_MAP[vm.STATE]
      } else {
        vm.EXTEND_STATE = '其他'
      }
      vm.EXTEND_DOMAIN_NAME = _.get(vm, ['DOMAIN_NAME'], '--')
      vm.EXTEND_NAME_WITH_ALIAS = vm.ALIAS ? `${vm.NAME}(${vm.ALIAS})` : vm.NAME
    })
    return vms
  }

  complex(vms) {
    const items = []
    const map = {} // id map
    const mapByEpcId = {}
    const mapByLcuuid = {}
    const mapByRegionId = {}
    const mapByMac = {}
    const mapByLaunchServer = {}
    _.forEach(vms, vm => {
      items.push({
        text: vm.NAME,
        value: vm.ID,
      })
      map[vm.ID] = vm
      mapByLcuuid[vm.LCUUID] = vm
      mapByEpcId[vm.EPC_ID] = mapByEpcId[vm.EPC_ID] || []
      mapByEpcId[vm.EPC_ID].push(vm)
      mapByRegionId[vm.REGION] = mapByRegionId[vm.REGION] || []
      mapByRegionId[vm.REGION].push(vm)
      mapByLaunchServer[vm.LAUNCH_SERVER] = mapByLaunchServer[vm.LAUNCH_SERVER] || []
      mapByLaunchServer[vm.LAUNCH_SERVER].push(vm)
      _.forEach(vm.INTERFACES, inter => {
        mapByMac[inter.MAC] = vm
      })
    })
    return {
      origin: vms,
      map,
      items,
      mapByEpcId,
      mapByRegionId,
      mapByLaunchServer,
      mapByMac,
      mapByLcuuid,
    }
  }
}

/**
 * host
 */
export class Host extends API {
  extend(hosts) {
    _.forEach(hosts, host => {
      host.EXTEND_STATE = HOST_STATE_MAP[host.STATE]
      host.EXTEND_DOMAIN_NAME = _.get(host, 'DOMAIN_NAME', '--')
      host.EXTEND_NAME = host.NAME + ' (' + host.EXTEND_DOMAIN_NAME + ')'
      // TODO 需要解释说明
      if (host.HTYPE === 3 && host.TYPE === 1) {
        host.EXTEND_TYPE = 'KVM计算节点'
      } else if (host.TYPE === 3 && host.TYPE === 3) {
        host.EXTEND_TYPE = '网络节点'
      } else if (host.HTYPE === 2) {
        host.EXTEND_TYPE = 'ESXi计算节点'
      } else {
        host.EXTEND_TYPE = '--'
      }
    })
    return hosts
  }

  complex(hosts) {
    const mapByIp = {}
    const items = []
    const hostList = []
    const hostIpList = []
    const mapById = {}

    _.forEach(hosts, host => {
      mapByIp[host.IP] = host
      mapById[host.ID] = host
      items.push({
        text: host.NAME,
        value: host.ID,
      })
      hostList.push({
        text: host.EXTEND_NAME,
        value: host.ID
      })
      hostIpList.push({
        text: host.NAME,
        value: host.IP
      })
    })
    return {
      origin: hosts,
      mapByIp,
      mapById,
      items,
      hostList,
      hostIpList,
    }
  }

  getDropPacket(...args) {
    return request('/hosts/analyzer-queue-drops', ...args)
  }
}

export class Subnet extends API {
  extend(subnets) {
    _.forEach(subnets, subnet => {
      subnet.EXTEND_NETS_STRING = subnet.NETS.map(net => {
        return `${net.PREFIX}/${net.NETMASK}`
      }).join(' ')
      subnet.EXTEND_NAME = subnet.NAME + ' (' + subnet.DOMAIN_NAME + ')'
      subnet.EXTEND_NAME_WITH_ALIAS = subnet.ALIAS
        ? `${subnet.NAME}(${subnet.DOMAIN_NAME},${subnet.ALIAS})`
        : subnet.EXTEND_NAME
    })
    return subnets
  }

  complex(subnets) {
    const items = []
    const subnetList = []
    const map = {} // id map
    const mapByEpcId = {}
    const mapByRegionId = {}
    let mapByLcuuid = {}
    _.forEach(subnets, subnet => {
      items.push({
        text: subnet.NAME,
        value: subnet.ID,
      })
      subnetList.push({
        text: subnet.EXTEND_NAME,
        value: subnet.ID
      })
      map[subnet.ID] = subnet
      mapByEpcId[subnet.EPC_ID] = mapByEpcId[subnet.EPC_ID] || []
      mapByEpcId[subnet.EPC_ID].push(subnet)
      mapByRegionId[subnet.REGION] = mapByRegionId[subnet.REGION] || []
      mapByRegionId[subnet.REGION].push(subnet)
      mapByLcuuid[subnet.LCUUID] = subnet
    })
    return {
      origin: subnets,
      map,
      items,
      subnetList,
      mapByEpcId,
      mapByRegionId,
      mapByLcuuid,
    }
  }
}

class Contact extends API {
  extend(contacts) {
    _.forEach(contacts, contact => {
      contact.EXTEND_EPC_COUNT = contact.EPCS ? contact.EPCS.length : 0
      contact.EXTEND_TYPE = contact.CREATE_METHOD === 1 ? '云平台学习' : '自定义'
      contact.EXTEND_ALARM_PUSH = contact.ALARM_PUSH === 1 ? '打开' : '关闭'
      contact.EXTEND_REPORT_PUSH = contact.REPORT_PUSH === 1 ? '打开' : '关闭'
      contact.EXTEND_PLATFORM = PLATFORM_TYPE[contact.DOMAIN_TYPE]
      contact.EXTEND_DOMAIN_NAME = contact.DOMAIN_NAME || '--'
    })
    return contacts
  }
}

/**
 * 业务
 */
export class Business extends API {
  extend(businesses) {
    _.forEach(businesses, business => {
      business.EXTEND_TYPE = OBJECT_TYPE_TEXT[business.TYPE]
      if (business.TYPE === OBJECT_TYPE_IP) {
        business.EXTEND_SCOPE = business.SCOPE.join(',')
      }
    })
    return businesses
  }

  complex(objs) {
    const items = []
    const map = {}
    _.forEach(objs, obj => {
      items.push({
        text: obj.NAME,
        value: obj.ID,
      })
      map[obj.ID] = obj
    })
    return {
      origin: objs,
      items,
      map,
    }
  }

  static interpret(business, epcMap, userMap) {
    if (epcMap) {
      if (business.TYPE === OBJECT_TYPE_VPC) {
        // 此处使用"EXTEND"前缀，因为ip类型时，不需要翻译
        business.EXTEND_SCOPE = _.get(epcMap, [business.EPC_ID, 'EXTEND_NAME'], '')
      }
    }
    if (userMap) {
      if (business.ID === OBJECT_ID_DATA_CENTER || business.ID === OBJECT_ID_WAN) {
        business.INTERPRETED_USER_NAME = '全局业务'
      } else {
        business.INTERPRETED_USER_NAME = _.get(userMap, [business.USER_ID, 'USERNAME'])
      }
      business.INTERPRETED_NAME = business.NAME + `（${business.INTERPRETED_USER_NAME}）`
      business.INTERPRETED_USER_TYPE = _.get(userMap, [business.USER_ID, 'USER_TYPE'])
    }
    return business
  }
}

export class Service extends API {
  complex(services) {
    const items = [] // 为了适配autocompletes
    const map = {}
    const aclgidMap = {}
    _.forEach(services, service => {
      items.push({
        text: service.NAME,
        value: service.ID,
      })
      map[service.ID] = service
      aclgidMap[service.POLICY_ACL_GROUP_ID] = service
    })
    return {
      map,
      aclgidMap,
      items,
      origin: services,
    }
  }

  static interpret(service, rgMap, tapTypeMap) {
    service.EXTEND_SRC_GROUP_IDS =
      service.SRC_GROUP_IDS.length ?
        _.map(
          service.SRC_GROUP_IDS, id => _.get(rgMap, [id, 'NAME'], '未知资源组')
        ).join(',') :
        'Any'
    service.EXTEND_DST_GROUP_IDS =
      service.DST_GROUP_IDS.length ?
        _.map(
          service.DST_GROUP_IDS, id => _.get(rgMap, [id, 'NAME'], '未知资源组')
        ).join(',') :
        'Any'
    if (tapTypeMap) {
      service.INTERPRETED_TAP_TYPE = _.get(tapTypeMap, [service.TAP_TYPE, 'NAME'])
    }
  }
}

export const Strategy = Service

export class MonitorIP extends API {
  extend(ips) {
    _.forEach(ips, ip => {
      ip.EXTEND_IP_MASK =
        ip.IS_BLOCK === 0 ? `${ip.IP}/32` : `${ip.IP}/${ip.NETMASK}`
      // ip.EXTEND_TYPE = ip.TYPE === 0 ? '学习' : '自定义'
    })
    return _.filter(ips, ip => ip.TYPE !== 0)
  }

  check(method, data) {
    data.CHECK = true
    if (method === 'create') {
      return this[method]({ data }).then(ack => {
        return ack.NUM || 0
      })
    } else {
      return this[method](null, { data }).then(ack => {
        return ack.NUM || 0
      })
    }
  }
}

export class Log extends API {
  extend(logs) {
    if (logs && logs.length) {
      _.forEach(logs[0].hits, log => {
        log.EXTEND_TIME = moment(log.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
        log.EXTEND_SEVERITY = LOG_SEVERITY[log.severity]
        log.EXTEND_TYPE = LOG_TYPE[log.type]
        log.MESSAGE_COLOR = LOG_TYPE[log.type]
      })
    }
    return logs
  }

  static interpret(log, userMap) {
    log.INTERPRETED_USER_NAME = ''
    if (log.userid === '0') {
      log.INTERPRETED_USER_NAME = '系统'
    } else if(log.userid){
      log.INTERPRETED_USER_NAME = `${_.get(userMap, [log.userid, 'EMAIL'], '')}
      (${_.get(userMap, [log.userid, 'EXTEND_USERNAME'], '')})`
    }
  }
}

export class User extends API {
  getAll() {
    return request(this.url + '/all').then(data => {
      return this.complex(this.extend(data.DATA))
    })
  }

  extend(users) {
    // let phoneReg = /(\d{3})\d{4}(\d{4})/
    // let emailReg = /(.{1})(.+)(@.+)/
    _.forEach(users, user => {
      user.EXTEND_STATE = USER_STATE_MAP[user.STATE] || '-'
      user.EXTEND_USER_TYPE = USER_TYPE_MAP[user.USER_TYPE] || '-'
      user.EXTEND_USERNAME =
        user.USERNAME + (user.DELETED === USER_DELETED ? '（已删除）' : '')
      // user.EXTEND_PHONE_NUM = user.PHONE_NUM ? user.PHONE_NUM.replace(phoneReg, "$1****$2") : ''
      // user.EXTEND_EMAIL = user.EMAIL ? user.EMAIL.replace(emailReg, "$1****$3") : ''
    })
    return users
  }

  complex(users) {
    const map = {}
    _.forEach(users, user => {
      map[user.ID] = user
    })
    return {
      map,
      origin: users,
    }
  }

  getCurrent() {
    return request(this.url + '/current')
  }

  logout() {
    return request(this.url + '/logout')
  }

  lock(...args) {
    return request(this.url + '/lock', ...args)
  }

  unlock(...args) {
    return request(this.url + '/unlock', ...args)
  }
}

export class Tenant extends API {
  getVpc(...args) {
    return request(this.url + '/vpc', ...args).then(
      data => this.determineReturn(data)
    )
  }

  getSelfVpc(...args) {
    return request(this.url + '/vpc/self', ...args).then(
      data => this.determineReturn(data)
    )
  }

  bindVpc(...args) {
    return request(this.url + '/vpc/bind', ...args)
  }

  unbindVpc(...args) {
    return request(this.url + '/vpc/unbind', ...args)
  }

  lock(...args) {
    return request(this.url + '/lock', ...args)
  }

  unlock(...args) {
    return request(this.url + '/unlock', ...args)
  }

  extend(users) {
    // let phoneReg = /(\d{3})\d{4}(\d{4})/
    // let emailReg = /(.{1})(.+)(@.+)/
    _.forEach(users, user => {
      user.EXTEND_STATE = USER_STATE_MAP[user.STATE] || '-'
      user.EXTEND_USER_TYPE = USER_TYPE_MAP[user.USER_TYPE] || '-'
      // user.EXTEND_PHONE_NUM = user.PHONE_NUM ? user.PHONE_NUM.replace(phoneReg, "$1****$2") : ''
      // user.EXTEND_EMAIL = user.EMAIL ? user.EMAIL.replace(emailReg, "$1****$3") : ''
    })
    return users
  }
}


const SYSTEM_ALARM_EVENT_MEASURE_VALUE_LIST = [
  TRIGGER_TYPE_VTAP_PACKAGE,
  TRIGGER_TYPE_ANALYZER_PACKAGE,
  TRIGGER_TYPE_CONTROLLER,
  TRIGGER_TYPE_ANALYZER_LOAD,
  TRIGGER_TYPE_VTAP_FLOW,
  TRIGGER_TYPE_VTAP_ANALAZY,
  TRIGGER_TYPE_VTAP_CPU,
  TRIGGER_TYPE_VTAP_MEMORY
]
export class AlarmEvent extends API {
  /**
   * 告警随时间的分布
   * @param args
   * @return {Promise}
   */
  getDistribution(...args) {
    return request(`${this.url}/distribution`, ...args)
  }

  extend(items) {
    _.forEach(items, s => {
      s.contrast_type = s.contrast_type || APP_TYPE_SYSTEM
      s.EXTEND_POLICY_NAME = s.policy_name || '--'
      s.EXTEND_APP_TYPE_NAME = APP_MAP[s.policy_app_type]
      s.EXTEND_TYPE_NAME = SUB_APP_MAP[1]
      s.EXTEND_SUB_TYPE_NAME = SUB_TYPE_MAP[s.policy_sub_type]
      s.EXTEND_LEVEL = ALARM_LEVEL_MAP[s.policy_level]
      s.EXTEND_START_TIME = moment.unix(s.timestamp).format('YYYY-MM-DD HH:mm:ss')
      s.EXTEND_TRIGGER_CONDITION = s.trigger_condition
      s.EXTEND_POLICY_TARGET_NAME = s.policy_target_name
      if (s.status === 'end' || s.status === 'happened') {
        s.EXTEND_END_TIME = moment.unix(s.end_time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        s.EXTEND_END_TIME = '尚未结束'
      }
      if (s.policy_app_type === APP_TYPE_VIEW) {
        s.EXTEND_DATA_LEVEL = ALARM_DATA_LEVEL_MAP[s.policy_data_level]
        s.EXTEND_INTRODUCTION = `${s.sub_view_name}, ${s.trigger_condition}`
      }
      // 系统
      if (s.policy_app_type === APP_TYPE_SYSTEM) {
        s.EXTEND_UNIT = TRIGGER_TYPE_UNIT_MAP[s.trigger_type]
        s.EXTEND_INTRODUCTION = `${s.policy_target_name}，${s.trigger_condition}`
      }
      if (
        SYSTEM_ALARM_EVENT_MEASURE_VALUE_LIST.includes(s.trigger_type)
      ) {
        s.EXTEND_MEASURED_VALUE = `${_.get(s, 'value', '')}${_.get(s, 'EXTEND_UNIT', '')}`
      }
    })
  }

  static interpret(alarmEvent, objectMap) {
    if (alarmEvent.sub_view_name && alarmEvent.policy_app_type === APP_TYPE_VIEW) {
      alarmEvent.INTERPRETED_BUSINESS_NAME = '子视图：' + alarmEvent.sub_view_name
    } else {
      alarmEvent.INTERPRETED_BUSINESS_NAME = _.get(objectMap, [alarmEvent.business_id, 'NAME'])
    }
  }
}

export class AlarmStrategy extends API {
  extend(items) {
    _.forEach(items, s => {
      s.EXTEND_SUB_TYPE_NAME = SUB_TYPE_MAP[s.SUB_TYPE]
      s.EXTEND_APP_TYPE = APP_MAP[s.APP_TYPE]
      s.EXTEND_CONTRAST_TYPE = SUB_APP_MAP[s.CONTRAST_TYPE]
      s.EXTEND_UPDATED_AT = moment.unix(s.UPDATED_AT).format('YYYY-MM-DD HH:mm:ss')
      s.EXTEND_LEVEL = ALARM_LEVEL_MAP[s.LEVEL]
      s.EXTEND_LABELS = s.LABELS.join(',')
      if (s.DURATION === 1) {
        // 未勾选附加条件
        s.DURATION = ''
        s.COUNT = ''
        s.option = false
      } else {
        s.option = true
      }
    })
    return items
  }

  complex(policies) {
    const mapById = {}
    _.forEach(policies, policy => {
      mapById[policy.ID] = policy
    })
    return {
      origin: policies,
      mapById,
    }
  }

  static interpret(s, CategoryMap, objectMap, alarmEndPoints) {
    s.metrics = _.get(objectMap, [s.SUB_VIEW_ID, 'METRICS'], [])
    // 视图
    s.EXTEDN_ENDPOINTS = '--'
    if (s.ENDPOINTS.length) {
      let endPoints = []
      _.forEach(s.ENDPOINTS, point => {
        let data = _.find(alarmEndPoints, ['ID', point])
        if (data) {
          endPoints.push(data)
        }
      })
      let pointMapByType = _.reduce(endPoints, (result, item, key) => {
        (result[item.PUSH_TYPE] || (result[item.PUSH_TYPE] = [])).push(item.NAME)
        return result
      }, {})
      let endPointsText = ''
      _.map(pointMapByType, (item, key) => {
        endPointsText += `${ENDPOINT_PUSH_TYPE_MAP[key]}: ${_.join(item, ', ')}<br>`
      })
      s.EXTEDN_ENDPOINTS = endPointsText
    }
    if (s.APP_TYPE === APP_TYPE_VIEW) {
      s.SUB_VIEW_NAME = _.get(objectMap, [s.SUB_VIEW_ID, 'NAME'], '未知')
      s.SUB_VIEW_NAME = '子视图：' + s.SUB_VIEW_NAME
      s.UPPER_THRESHOLD_Str = s.UPPER_THRESHOLD
        ? (s.UPPER_THRESHOLD * 1).toLocaleString('en-US')
        : ''
      s.LOWER_THRESHOLD_Str = s.LOWER_THRESHOLD
        ? (s.LOWER_THRESHOLD * 1).toLocaleString('en-US')
        : ''
      // 绝对值
      if (s.CONTRAST_TYPE === APP_TYPE_SYSTEM) {
        let flag = (!_.isEmpty(CategoryMap)) && (!_.isEmpty(CategoryMap[s.TARGET_FIELD]))
        let unit = s.TARGET_FIELD && flag ? CategoryMap[s.TARGET_FIELD].unit : ''
        if (s.LOWER_THRESHOLD && s.UPPER_THRESHOLD) {
          s.THRESHOLD = `${ALARM_CONTRAST_MAP[s.CONTRAST_TYPE]}大于
          ${s.UPPER_THRESHOLD_Str}${unit}或者小于${s.LOWER_THRESHOLD_Str}${unit}`
        } else {
          let TERM = s.UPPER_THRESHOLD ? '大于' : '小于'
          s.THRESHOLD = ALARM_CONTRAST_MAP[s.CONTRAST_TYPE] +
            TERM + (s.UPPER_THRESHOLD_Str || s.LOWER_THRESHOLD_Str) + unit
        }
        let line = `${s.TARGET_LINE_NAME}的` || ''
        let label = s.TARGET_FIELD && flag ? CategoryMap[s.TARGET_FIELD].label : ''
        s.EXTEND_TRIGGER_CONDITION = line + label + s.THRESHOLD
      }
      // 基线
      if (s.CONTRAST_TYPE === APP_TYPE_VIEW) {
        s.EXTEND_TRIGGER_CONDITION =
          `${CategoryMap[s.TARGET_FIELD]}超出基线范围`
      }
    }
    // 系统
    if (s.APP_TYPE === APP_TYPE_SYSTEM) {
      s.SUB_VIEW_NAME = _.get(objectMap, [s.BUSINESS_ID, 'NAME'], '')
      s.EXTEND_TRIGGER_CONDITION = TRIGGER_CONDITION_MAP[s.TRIGGER_TYPE]
    }
  }
}

export class AlarmEndPoints extends API {
  extend(items) {
    _.forEach(items, s => {
      s.EXTEND_UPDATED_AT = moment.unix(s.UPDATED_AT).format('YYYY-MM-DD HH:mm:ss')
    })
    return items
  }
}

export class ReportStrategy extends API {
  extend(reportstrategies) {
    _.forEach(reportstrategies, stra => {
      stra.EXTEND_NAME = `${stra.NAME}(已生成${stra.REPORT_COUNT}个)`
      stra.EXTEND_TYPE = APP_MAP[stra.APP_TYPE]
      stra.EXTEND_SUB_TYPE = REPORT_TYPE_MAP[stra.REPORT_TYPE]
      stra.EXTEND_TAP_TYPE = TAP_TYPE_MAP[stra.TAP_TYPE]
      // stra.EXTEND_INTERVAL = REPORT_INTERVAL_MAP[stra.INTERVAL]
      // if (stra.REPORT_TYPE === REPORT_TYPE_WEEKLY) {
      //   stra.EXTEND_TIME = `每周${WEEK[stra.BEGIN_AT]}`
      // } else if (stra.REPORT_TYPE === REPORT_TYPE_MONTHLY) {
      //   stra.EXTEND_TIME = `每月${stra.BEGIN_AT}日`
      // }
      stra.EXTEND_EMAIL = stra.PUSH_EMAIL.join(',')
    })
    return reportstrategies
  }

  static interpret(item, views) {
    const viewMap = {}
    _.forEach(views, view => {
      viewMap[view.ID] = view
    })
    item.INTERPRETED_OBJECT_NAME = _.get(viewMap, [item.VIEW_ID, 'NAME'])
    // item.INTERPRETED_OBJECT_NAME = _.get(objectMap, [item.BUSINESS_ID, 'NAME'])
    // if (item.SERVICE_ID && Array.isArray(item.SERVICE_ID)) {
    //   item.INTERPRETED_SERVICE_NAME = _.reduce(item.SERVICE_ID, (acc, SERVICE_ID) => {
    //     if (_.get(serviceMap, [SERVICE_ID, 'NAME'])) {
    //       acc.push(_.get(serviceMap, [SERVICE_ID, 'NAME']))
    //     }
    //     return acc
    //   }, []).join(',')
    // } else {
    //   item.INTERPRETED_SERVICE_NAME = _.get(serviceMap, [item.SERVICE_ID, 'NAME'])
    // }
  }
}

export class Report extends API {
  extend(reports) {
    _.forEach(reports, report => {
      report.EXTEND_TYPE = APP_MAP[report.APP_TYPE]
      report.EXTEND_SUB_TYPE = REPORT_TYPE_MAP[report.REPORT_TYPE]
    })
    return reports
  }

  static interpret(item, views, strategys) {
    const viewMap = {}
    const strategyMap = {}
    _.forEach(views, view => {
      viewMap[view.ID] = view
    })
    _.forEach(strategys, strategy => {
      strategyMap[strategy.ID] = strategy
    })
    item.EXTEND_VIEW_NAME = _.get(viewMap, [item.VIEW_ID, 'NAME'])
    item.EXTEND_STRATEGY_NAME = _.get(strategyMap, [item.POLICY_ID, 'NAME'])
    // if (item) {
    //   item.EXTEND_BUSINESS_NAME = _.get(objectMap, [item.BUSINESS_ID, 'NAME'])
    //   // item.EXTEND_SERVICE_NAME = _.get(serviceMap, [item.SERVICE_ID, 'NAME'])
    //   if (item.SERVICE_ID && Array.isArray(item.SERVICE_ID)) {
    //     item.EXTEND_SERVICE_NAME = _.reduce(item.SERVICE_ID, (acc, SERVICE_ID) => {
    //       if (_.get(serviceMap, [SERVICE_ID, 'NAME'])) {
    //         acc.push(_.get(serviceMap, [SERVICE_ID, 'NAME']))
    //       }
    //       return acc
    //     }, []).join(',')
    //   } else {
    //     item.EXTEND_SERVICE_NAME = _.get(serviceMap, [item.SERVICE_ID, 'NAME'])
    //   }
    // }
  }
}

/**
 * vtap
 */
class Vtap extends API {
  complex(vtaps) {
    let mapByLcuuid = {}
    let mapByLaunchServer = {}
    let mapById = {}
    _.forEach(vtaps, vtap => {
      mapByLcuuid[vtap.LCUUID] = vtap
      mapByLaunchServer[vtap.LAUNCH_SERVER] = mapByLaunchServer[vtap.LAUNCH_SERVER] || []
      mapByLaunchServer[vtap.LAUNCH_SERVER].push(vtap)
      mapById[vtap.ID] = vtap
    })

    return {
      origin: vtaps,
      mapByLcuuid,
      mapByLaunchServer,
      mapById
    }
  }
}

/**
 * vtapConfig
 */
export class VtapLog extends API {
  extend(logs) {
    if (logs && logs.length) {
      _.forEach(logs[0].hits, log => {
        log.EXTEND_TIME = moment(log.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
        log.EXTEND_SEVERITY = LOG_SEVERITY[log.severity]
        log.EXTEND_TYPE = LOG_TYPE[log.type]
        log.MESSAGE_COLOR = LOG_SEVERITY_COLOR[log.severity]
      })
    }
    return logs
  }
}

/**
 * vtapConfig
 */
 export class VtapInterfaces extends API {
  extend(vtapInterfaces) {
    return vtapInterfaces
  }
}

/**
 * vtapConfig
 */
class VtapConfig extends API {
  complex(vtapConfigs) {
    let mapByLcuuid = {}
    let mapByVtapGroupLcuuid = {}
    let mapByVtapLcuuid = {}
    _.forEach(vtapConfigs, vtapConfig => {
      mapByLcuuid[vtapConfig.LCUUID] = vtapConfig
      mapByVtapGroupLcuuid[vtapConfig.VTAP_GROUP_LCUUID] = vtapConfig
      mapByVtapLcuuid[vtapConfig.VTAP_LCUUID] = vtapConfig
    })
    return {
      origin: vtapConfigs,
      mapByLcuuid,
      mapByVtapLcuuid,
      mapByVtapGroupLcuuid,
    }
  }
}

/**
 * vtapGroupConfig
 */
class VtapGroupConfig extends API {
  complex(vtapGroupConfigs) {
    let mapByLcuuid = {}
    let mapByVtapLcuuid = {}
    _.forEach(vtapGroupConfigs, vtapGroupConfig => {
      mapByLcuuid[vtapGroupConfig.LCUUID] = vtapGroupConfig
      mapByVtapLcuuid[vtapGroupConfig.VTAP_LCUUID] = vtapGroupConfig
    })
    return {
      origin: vtapGroupConfigs,
      mapByLcuuid,
      mapByVtapLcuuid,
    }
  }
}

/**
 * vgateway
 */
class Vgateway extends API {
  complex(vgateways) {
    let mapByEpcId = {}
    let mapById = {}
    _.forEach(vgateways, vgateway => {
      mapById[vgateway.ID] = vgateway
      mapByEpcId[vgateway.EPC_ID] = mapByEpcId[vgateway.EPC_ID] || []
      mapByEpcId[vgateway.EPC_ID].push(vgateway)
    })
    return {
      origin: vgateways,
      mapById,
      mapByEpcId,
    }
  }
}

/**
 * region
 */
export class Region extends API {
  extend(regions) {
    _.forEach(regions, region => {
      region.EXTEND_DOMAIN_NAME = _.get(region, 'DOMAIN_NAME', '--')
    })
    return regions
  }

  complex(regions) {
    const items = []
    const regionList = []
    const map = {};
    const mapByLcuuid = {};
    _.forEach(regions, region => {
      items.push({
        text: region.NAME,
        value: region.ID,
      })
      regionList.push({
        text: region.NAME,
        value: region.LCUUID,
        id: region.ID
      })
      map[region.ID] = region
      mapByLcuuid[region.LCUUID] = region
    })
    return {
      origin: regions,
      map,
      regionList,
      items,
      mapByLcuuid,
    }
  }

  static interpret(region, vpcMapByRegion, vmMapByRegion, subnetMapByRegion) {
    region.EXTEND_VPC_NUM = _.get(vpcMapByRegion, [region.LCUUID], []).length
    region.EXTEND_VM_NUM = _.get(vmMapByRegion, [region.LCUUID], []).length
    region.EXTEND_SUBNET_NUM = _.get(subnetMapByRegion, [region.LCUUID], []).length
    return region
  }
}

/**
 * controller
 */
export class Controller extends API {
  extend(controllers) {
    _.forEach(controllers, controller => {
      controller.CPU_USAGE_EXTEND = `${numberToSigfig(controller.CPU_USAGE)}%`
      controller.EXTEND_STATE = CONTROLLER_STATE_MAP[controller.STATE]
      controller.EXTEND_MEM = `${numberToSigfigShort(controller.MEM_USED, 1024)}`
        + `/${numberToSigfigShort(controller.MEM_TOTAL, 1024)}`
      controller.EXTEND_ROLE = _.get(CONTROLLER_ROLE_TYPE, controller.ROLE, '--')
      controller.EXTEND_MASTER = controller.MASTER ? '是' : '否'
      controller.EXTEND_NODE_TYPE = controller.NODE_TYPE === 1 ? '是' : '否'
      controller.EXTEND_ARCH = _.get(controller, 'ARCH', '') || '--'
      controller.EXTEND_OS = _.get(controller, 'OS', '') || '--'
      controller.EXTEND_KERNEL_VERSION = _.get(controller, 'KERNEL_VERSION', '') || '--'
      controller.EXTEND_CPU_NUM = _.get(controller, 'CPU_NUM', '') || '--'
      controller.EXTEND_MEMORY_SIZE = numberToSigfigShort(_.get(controller, 'MEMORY_SIZE', ''), 1024) || '--'
    })
    return controllers
  }

  complex(controllers) {
    return {
      origin: controllers
    }
  }

  getCPUUsage(...args) {
    return request(this.url + '/cpuStats', ...args)
  }

  getMemoryUsage(...args) {
    return request(this.url + '/memoryStats', ...args)
  }

  getDiskUsage(...args) {
    return request(this.url + '/diskStats', ...args)
  }

  getLoadUsage(...args) {
    return request(this.url + '/loadStats', ...args)
  }
}

/**
 * NpbTunnel
 */
class NpbTunnel extends API {
  extend(tunnels) {
    _.forEach(tunnels, tunnel => {
      tunnel.EXTEND_TYPE = TUNNEL_TYPE_MAP[tunnel.TYPE]
    })
    return tunnels
  }

  complex(tunnels) {
    const items = []
    const map = {};
    _.forEach(tunnels, tunnel => {
      items.push({
        text: tunnel.NAME,
        value: tunnel.ID,
      })
      map[tunnel.ID] = tunnel
    })
    return {
      origin: tunnels,
      map,
      items,
    }
  }
}

/**
 * NpbPolicy
 */
class NpbPolicy extends API {
  extend(policies) {
    _.forEach(policies, policy => {
      if (policy.STATE === NPB_POLICY_ENABLED) {
        policy.EXTEND_STATE = '运行'
      } else if (policy.STATE === NPB_POLICY_DISABLED) {
        policy.EXTEND_STATE = '禁用'
      } else {
        policy.EXTEND_STATE = '未知'
      }
    })
    return policies
  }
}

/**
 * config
 */
class SystemConfig extends API {
  complex(configs) {
    return {
      origin: configs
    }
  }
}

class TapType extends API {
  extend(taptypes) {
    _.forEach(taptypes, taptype => {
      taptype.EXTEND_TYPE = TAP_TYPE_TYPE_MAP[taptype.TYPE]
      taptype.EXTEND_REGION_NAME = taptype.REGION_NAME || '--'
      let EXTEND_VLAN = _.get(taptype, 'VLAN', '--')
      taptype.EXTEND_VLAN = EXTEND_VLAN === null ? '--' : EXTEND_VLAN
      taptype.EXTEND_SRC_IP = taptype.SRC_IP || '--'
      taptype.EXTEND_INTER_INDEX = taptype.INTERFACE_INDEX || '--'
      taptype.EXTEND_INTER_NAME = taptype.INTERFACE_NAME || '--'
      taptype.EXTEND_SAMPLING_RATE = taptype.SAMPLING_RATE || '--'
    })
    return taptypes
  }

  complex(taptypes) {
    const items = [] // 为了适配autocompletes
    const map = {};
    _.forEach(taptypes, taptype => {
      items.push({
        text: taptype.NAME,
        value: taptype.VALUE,
      })
      map[taptype.VALUE] = taptype
    })
    return {
      map,
      items,
      origin: taptypes,
    }
  }

  static interpret(taptype, regionMap) {
    if (regionMap) {
      taptype.REGION_NAME = _.get(regionMap, [taptype.REGION, 'NAME'], '--')
    }
  }
}

class SystemConf extends API {
  complex(configs) {
    return {
      origin: configs
    }
  }
}

class RouteTable extends API {
  complex(route_tables) {
    return {
      origin: route_tables
    }
  }
}

class SecurityGroup extends API {
  extend(securityGroups) {
    _.forEach(securityGroups, security => {
      security.EXTEND_NAME = security.NAME + ' (' + security.DOMAIN_NAME + ')'
    })
    return securityGroups
  }

  complex(securityGroups) {
    const mapById = {}
    const items = []
    const securityList = []
    _.forEach(securityGroups, security => {
      items.push({
        text: security.NAME,
        value: security.ID,
      })
      securityList.push({
        text: security.EXTEND_NAME,
        value: security.ID
      })
      mapById[security.ID] = security
    })
    return {
      origin: securityGroups,
      mapById,
      items,
      securityList,
    }
  }
}
class SecurityGroupRules extends API {
  complex(rules) {
    const mapBySgId = {}
    _.forEach(rules, rule => {
      mapBySgId[rule.SG_ID] = mapBySgId[rule.SG_ID] || []
      mapBySgId[rule.SG_ID].push(rule)
    })
    return {
      origin: rules,
      mapBySgId,
    }
  }
}

/**
 * pcapPolicy
 */
class PcapPolicy extends API {
  extend(policies) {
    _.forEach(policies, policy => {
      if (policy.STATE === NPB_POLICY_ENABLED) {
        policy.EXTEND_STATE = '运行'
      } else if (policy.STATE === NPB_POLICY_DISABLED) {
        policy.EXTEND_STATE = '禁用'
      } else {
        policy.EXTEND_STATE = '未知'
      }
    })
    return policies
  }

  complex(policies) {
    const mapByLcuuid = {}
    _.forEach(policies, policy => {
      mapByLcuuid[policy.LCUUID] = policy
    })
    return {
      origin: policies,
      mapByLcuuid,
    }
  }
}

/**
 * vtap
 */
class VtapGroup extends API {
  extend(vGroups) {
    _.forEach(vGroups, vGroup => {
      vGroup.EXTEND_VTAP_LENGTH = vGroup.VTAP_LCUUIDS && vGroup.VTAP_LCUUIDS.length
    })
    return vGroups
  }

  complex(vGroups) {
    let mapByLcuuid = {}
    _.forEach(vGroups, vGroup => {
      mapByLcuuid[vGroup.LCUUID] = vGroup
    })

    return {
      origin: vGroups,
      mapByLcuuid,
    }
  }
}

class DataCenter extends API {
  complex(dataCenters) {
    const items = []
    const mapById = {};
    _.forEach(dataCenters, dataCenter => {
      items.push({
        text: dataCenter.NAME,
        value: dataCenter.ID,
      })
      mapById[dataCenter.ID] = dataCenter
    })
    return {
      mapById,
      items,
      origin: dataCenters,
    }
  }
}

class TopoPosition extends API { }

class Cluster extends API {
  complex(clusters) {
    const map = {}
    _.forEach(clusters, cluster => {
      map[cluster.ID] = cluster
    })
    return {
      map,
      origin: clusters,
    }
  }
}

class PODGroup extends API {
  extend(podGroups) {
    _.forEach(podGroups, podGroup => {
      podGroup.EXTEND_NAME_WITH_ALIAS = podGroup.ALIAS
        ? `${podGroup.NAME}(${podGroup.ALIAS})`
        : podGroup.NAME
      podGroup.EXTEND_NAME_WITH_NAMESPACE = podGroup.POD_NAMESPACE_NAME
        ? `${podGroup.NAME}(${podGroup.POD_NAMESPACE_NAME})`
        : podGroup.NAME
    })
    return podGroups
  }

  complex(podGroups) {
    const items = []
    const map = {};
    const mapByClusterId = {};
    _.forEach(podGroups, podGroup => {
      items.push({
        text: podGroup.NAME,
        value: podGroup.ID,
      })
      map[podGroup.ID] = podGroup
      mapByClusterId[podGroup.POD_CLUSTER_ID] = mapByClusterId[podGroup.POD_CLUSTER_ID] || []
      mapByClusterId[podGroup.POD_CLUSTER_ID].push(podGroup)
    })
    return {
      map,
      mapByClusterId,
      items,
      origin: podGroups,
    }
  }
}

class POD extends API {
  complex(pods) {
    const map = {}
    _.forEach(pods, pod => {
      map[pod.ID] = pod
    })
    return {
      map,
      origin: pods,
    }
  }
}

class PodNode extends API {
  complex(podNodes) {
    const map = {}
    _.forEach(podNodes, podNode => {
      map[podNode.ID] = podNode
    })
    return {
      map,
      origin: podNodes,
    }
  }
}

export class NetworkElement extends API {
  extend(networkElements) {
    _.forEach(networkElements, networkElement => {
      networkElement.EXTEND_TYPE = NETWORK_ELEMENT_TYPE_MAP[networkElement.TYPE]
      networkElement.REGION_NAME = networkElement.REGION_NAME || '--'
      // networkElement.EXTEND_ORIGIN = NETWORK_ELEMENT_ORIGIN_MAP[networkElement.CREATE_METHOD]
    })
    return networkElements
  }

  complex(networkElements) {
    const map = {}
    _.forEach(networkElements, networkElement => {
      map[networkElement.ID] = networkElement
    })
    return {
      map,
      origin: networkElements,
    }
  }

  static addIcon(networkElement, iconMap) {
    const id = iconTypeMap[networkElement.TYPE]
    networkElement.INTERPRETED_ICON = _.get(iconMap, [id, 'CONTENT'], '')
    // networkElement.INTERPRETED_ICON_NAME = _.get(iconMap, [id, 'NAME'])
  }
}

export class Link extends API {
  complex(links) {
    const map = {}
    _.forEach(links, link => {
      map[link.ID] = link
    })
    return {
      map,
      origin: links,
    }
  }

  static interpret(link, networkElementMap, tapTypeMap, regionMap) {
    link.EXTEND_SRC_NET_ELEMENT =
      _.get(networkElementMap, [link.SRC_NET_ELE_ID, 'NAME'], '未知')
    link.EXTEND_DST_NET_ELEMENT =
      _.get(networkElementMap, [link.DST_NET_ELE_ID, 'NAME'], '未知')
    if (tapTypeMap) {
      link.INTERPRETED_SRC_TAP_TYPE = _.get(tapTypeMap, [link.SRC_TAP_TYPE, 'NAME'], '--')
      link.INTERPRETED_SRC_TAP_TYPE_TOOLTIP = link.INTERPRETED_SRC_TAP_TYPE
      let srcObj = _.get(tapTypeMap, link.SRC_TAP_TYPE, {})
      if (!_.isEmpty(srcObj) && link.SRC_TAP_TYPE) {
        if (_.get(srcObj, 'TYPE') === PACKET) {
          link.INTERPRETED_SRC_TAP_TYPE_TOOLTIP += `(PACKET，VLAN ${_.get(srcObj, 'VLAN', '--')})`
        }
        if (_.get(srcObj, 'TYPE') !== PACKET) {
          link.INTERPRETED_SRC_TAP_TYPE_TOOLTIP += `(${_.get(srcObj, 'EXTEND_TYPE', '--')}，
          接口-${_.get(srcObj, 'EXTEND_INTER_INDEX', '--')} `
          if (_.get(srcObj, 'INTERFACE_NAME')) {
            link.INTERPRETED_SRC_TAP_TYPE_TOOLTIP += `${_.get(srcObj, 'EXTEND_INTER_NAME', '--')}`
          }
          if (_.get(srcObj, 'SAMPLING_RATE')) {
            const samplingRateStr = `，采样率1:${_.get(srcObj, 'EXTEND_SAMPLING_RATE', '--')}`
            link.INTERPRETED_SRC_TAP_TYPE_TOOLTIP += samplingRateStr
          }
          link.INTERPRETED_SRC_TAP_TYPE_TOOLTIP += '）'
        }
      }
      let dstObj = _.get(tapTypeMap, link.DST_TAP_TYPE, {})
      link.INTERPRETED_DST_TAP_TYPE = _.get(tapTypeMap, [link.DST_TAP_TYPE, 'NAME'], '--')
      link.INTERPRETED_DST_TAP_TYPE_TOOLTIP = link.INTERPRETED_DST_TAP_TYPE
      if (!_.isEmpty(dstObj) && link.DST_TAP_TYPE) {
        if (_.get(dstObj, 'TYPE') === PACKET) {
          link.INTERPRETED_DST_TAP_TYPE_TOOLTIP += `(PACKET，VLAN ${_.get(dstObj, 'VLAN', '--')})`
        }
        if (_.get(dstObj, 'TYPE') !== PACKET) {
          link.INTERPRETED_DST_TAP_TYPE_TOOLTIP += `(${_.get(dstObj, 'EXTEND_TYPE', '--')}，
          接口-${_.get(dstObj, 'EXTEND_INTER_INDEX', '--')} `
          if (_.get(dstObj, 'INTERFACE_NAME')) {
            link.INTERPRETED_DST_TAP_TYPE_TOOLTIP += `${_.get(dstObj, 'EXTEND_INTER_NAME', '--')}`
          }
          if (_.get(dstObj, 'SAMPLING_RATE')) {
            const samplingRateStr = `，采样率1:${_.get(dstObj, 'EXTEND_SAMPLING_RATE', '--')}`
            link.INTERPRETED_DST_TAP_TYPE_TOOLTIP += samplingRateStr
          }
          link.INTERPRETED_DST_TAP_TYPE_TOOLTIP += '）'
        }
      }
    }
    if (regionMap) {
      link.REGION_NAME = _.get(regionMap, [link.REGION, 'NAME'], '--')
    }
  }
}

export class Icon extends API {
  complex(data) {
    return {
      origin: data,
      map: _.reduce(data, (acc, item) => {
        acc[item.ID] = item
        return acc
      }, {}),
      typeMap: _.reduce(data, (acc, item) => {
        if (item.ICON_TYPE >= INTERNET_ACCESS) {
          acc[item.ICON_TYPE] = item
        }
        return acc
      }, {})
    }
  }
}

export class PodService extends API {
  extend(services) {
    _.forEach(services, service => {
      service.EXTEND_NAME = `${service.NAME}(${service.POD_NAMESPACE_NAME})`
    })
    return services
  }

  complex(services) {
    const mapByClusterId = {};
    const map = {}
    _.forEach(services, service => {
      map[service.ID] = service
      mapByClusterId[service.POD_CLUSTER_ID] = mapByClusterId[service.POD_CLUSTER_ID] || []
      mapByClusterId[service.POD_CLUSTER_ID].push(service)
    })
    return {
      map,
      mapByClusterId,
      origin: services,
    }
  }

  getGroupPorts(...params) {
    return request('/pod-group-ports', ...params).then(data => data.DATA)
  }

  getServicePorts(...params) {
    return request('/pod-service-ports', ...params).then(data => data.DATA)
  }
}

export class PodServicePort extends API {
  complex(servicePorts) {
    const mapByPodService = {};
    _.forEach(servicePorts, port => {
      mapByPodService[port.POD_SERVICE_ID] = mapByPodService[port.POD_SERVICE_ID] || []
      mapByPodService[port.POD_SERVICE_ID].push(port)
    })
    return {
      mapByPodService,
      origin: servicePorts,
    }
  }
}

export class Legend extends API {
  complex(data) {
    const map = {}
    const items = []
    _.forEach(data, obj => {
      items.push({
        text: obj.NAME,
        value: obj.ID,
      })
      map[obj.ID] = obj
    })
    return {
      origin: data,
      items,
      map,
    }
  }
}
export class Metric extends API {
  complex(metrics) {
    let firstCategoryList = []
    let categoryCascaderList = []
    let firstCategoryMap = {}
    let secondCategoryMap = {}
    _.forEach(metrics, (item, key) => {
      let firstCategoryLabel = item.description
      let firstCategoryValue = key
      firstCategoryMap[key] = {
        label: item.description
      }
      let secondCategoryList = []
      _.forEach(item.metrics, (metric, i) => {
        secondCategoryMap[i] = {
          label: metric.description,
          value: i,
          firstCategoryLabel,
          firstCategoryValue,
          operator: _.map(metric.operator, (operator, o) => {
            return {
              label: `${_.upperFirst(o)}(${operator.return_field_unit})`,
              value: o,
              ...operator,
            }
          })
        }
        let operatorList = _.map(metric.operator, (operator, o) => {
          return {
            label: `${_.upperFirst(o)}(${operator.return_field_unit})`,
            value: o,
            ...operator,
          }
        })
        secondCategoryList.push({
          label: metric.description,
          value: i,
          operator: operatorList,
          children: operatorList,
        })
      })
      firstCategoryMap[key].options = secondCategoryList
      firstCategoryList.push({
        value: key,
        label: item.description,
        options: secondCategoryList,
      })
      categoryCascaderList.push({
        value: key,
        label: item.description,
        children: secondCategoryList,
      })
    })
    let CategoryMap = {}
    _.forEach(firstCategoryList, firstCategory => {
      _.forEach(firstCategory.options, option => {
        _.forEach(option.operator, ope => {
          CategoryMap[ope.return_field] = {
            label: ope.return_field_description,
            unit: ope.return_field_unit
          }
        })
      })
    })
    let firstCategoryMapByPacket = {}
    let abledFieldPacketMap = {
      traffic: {
        byte: true,
        byte_tx: true,
        byte_rx: true,
        packet: true,
        packet_tx: true,
        packet_rx: true,
      }
    }
    _.forEach(firstCategoryList, (item) => {
      let firstCategoryKey = item.value
      let secondCategoryList = item.options
      _.forEach(secondCategoryList, (secondItem) => {
        let secondCategoryKey = secondItem.value
        if (abledFieldPacketMap[firstCategoryKey]
          && abledFieldPacketMap[firstCategoryKey][secondCategoryKey]) {
          if (!firstCategoryMapByPacket[item.value]) {
            firstCategoryMapByPacket[item.value] = {
              value: item.value,
              label: item.label,
              options: [],
            }
          }
          firstCategoryMapByPacket[item.value].options.push(secondItem)
        }
      })
    })
    let firstCategoryListByPacket = _.map(firstCategoryMapByPacket, (item) => {
      return item
    })

    let categoryCascaderMapByPacket = {}
    _.forEach(categoryCascaderList, (item) => {
      let firstCategoryKey = item.value
      let secondCategoryList = item.children
      _.forEach(secondCategoryList, (secondItem) => {
        let secondCategoryKey = secondItem.value
        if (abledFieldPacketMap[firstCategoryKey]
          && abledFieldPacketMap[firstCategoryKey][secondCategoryKey]) {
          if (!categoryCascaderMapByPacket[item.value]) {
            categoryCascaderMapByPacket[item.value] = {
              value: item.value,
              label: item.label,
              children: [],
            }
          }
          categoryCascaderMapByPacket[item.value].children.push(secondItem)
        }
      })
    })
    let categoryCascaderListByPacket = _.map(categoryCascaderMapByPacket, (item) => {
      return item
    })
    return {
      secondCategoryMap,
      firstCategoryList,
      firstCategoryMap,
      origin: metrics,
      firstCategoryListByPacket: firstCategoryListByPacket,
      CategoryMap,
      categoryCascaderList,
      categoryCascaderListByPacket,
    }
  }
}

export class Az extends API {
}

export class LB extends API {
  complex(datas) {
    const lbMap = {}
    _.forEach(datas, data => {
      lbMap[data.ID] = data
    })
    return {
      lbMap,
    }
  }
}

export class LBRule extends API {
  complex(datas) {
    const lbMap = {}
    _.forEach(datas, data => {
      lbMap[data.ID] = data
    })
    return {
      lbMap,
    }
  }
}

export class PodResource extends API {
  complex(datas) {
    const podMap = {}
    const groupMap = {}
    _.forEach(datas, data => {
      _.forEach(data.POD_SERVICES, service => {
        podMap[service.POD_SERVICE_ID] = _.assign({
          groups: []
        }, service)
      })
      _.forEach(data.POD_SERVICES_GROUPS, item => {
        _.forEach(item.POD_GROUPS, group => {
          groupMap[group.POD_GROUP_ID] = group
          podMap[item.POD_SERVICE_ID].groups.push(group)
        })
      })
    })
    return {
      podMap,
      groupMap,
    }
  }
}

export class SubView extends API {
  complex(datas) {
    const subViewMap = {}
    _.forEach(datas, data => {
      subViewMap[data.ID] = data
    })
    return {
      map: subViewMap,
    }
  }
}
export class HistorySearchDefaultConfig extends API {
}

export class HistorySearch extends API {
}
export class DataSource extends API {
  extend(dataSources) {
    _.forEach(dataSources, dataSource => {
      dataSource.EXTEND_INTERVAL = INTERVAL_MAP[dataSource.INTERVAL]
      dataSource.EXTEND_STATE = STATE_MAP[dataSource.STATE]
      dataSource.EXTEND_TSDB_TYPE = TSDB_TYPE_MAP[dataSource.TSDB_TYPE]
      dataSource.EXTEND_BASE_DATA_SOURCE_NAME = dataSource.BASE_DATA_SOURCE_NAME || '--'
      dataSource.EXTEND_SUMMABLE_METRICS_OPERATOR = dataSource.SUMMABLE_METRICS_OPERATOR || '--'
      dataSource.EXTEND_UNSUMMABLE_METRICS_OPERATOR = dataSource.UNSUMMABLE_METRICS_OPERATOR || '--'
    })
    return dataSources
  }

  complex(datas) {
    const dataSourceMap = {}
    _.forEach(datas, data => {
      dataSourceMap[data.ID] = data
    })
    return {
      map: dataSourceMap,
    }
  }
}

export class PodNamespace extends API {
}

// 资源
export const az = new Az('/azs')
export const region = new Region('/regions')
export const host = new Host('/hosts')
export const epc = new EPC('/epcs')
export const subnet = new Subnet('/subnets')
export const vm = new VM('/vms')
export const ip = new IP('/ips/wan/learning')
export const wanip = new WANIP('/ips/wan')
export const resource = new Resource('/resources')
export const contact = new Contact('/contacts')
export const dbip = new DBIP('/dbIps')
export const business = new Business('/businesses')
/**
 * 现在都叫服务依赖
 */
export const service = new Service('/services')
export const strategy = service

export const monitorip = new MonitorIP('/ips/monitor')
export const log = new Log('/syslog')
export const user = new User('/users')
export const controller = new Controller('/controllers')
export const systemConfig = new SystemConfig('/system/config')
// 租户
export const tenant = new Tenant('/tenants')
// 告警
export const alarmStrategy = new AlarmStrategy('/alarm-policy')
export const alarmStatisticStrategy = new AlarmStrategy('/alarm-policy-statistic')
export const alarmEvent = new AlarmEvent('/alarm-event').set({
  dataField: 'DATA.hits',
  autoExtract: false,
})
export const alarmEndPoint = new AlarmEndPoints('/alarm-endPoints')

// 报表
export const reportStrategy = new ReportStrategy('/reportStrategy')
export const report = new Report('/report')
// 采集器
export const vtap = new Vtap('/vtaps')
export const vtapGroup = new VtapGroup('/vtap-groups')
export const vtapConfig = new VtapConfig('/vtap-system-configs')
export const vtapGroupConfig = new VtapGroupConfig('/vtap-group-configs')
export const vtaplog = new VtapLog('/vtaplog')
export const vtapInterfaces = new VtapInterfaces('/vtap-interfaces')
// 分发点 分发策略
export const npbTunnel = new NpbTunnel('/npb-tunnels')
export const npbPolicy = new NpbPolicy('/npb-policies')
// taptype 采集点
export const taptype = new TapType('/tap-type')
// 系统配置
export const systemConf = new SystemConf('/system/storage-conf')
// 路由器 路由表
export const vgateway = new Vgateway('/vgateways')
export const routeTable = new RouteTable('/routing-tables')
// 安全组 安全组规则
export const securityGroup = new SecurityGroup('/security-groups')
export const securityGroupRule = new SecurityGroupRules('/security-group-rules')
// PCAP策略
export const pcapPolicy = new PcapPolicy('/pcap-policies')
// 数据中心
export const datacenter = new DataCenter('/data-center')
// topo位置
export const topoPosition = new TopoPosition('/business/topo-position')
// k8s集群对接
export const cluster = new Cluster('/pod-clusters')
// POD POD节点 工作负载
export const pod = new POD('/pods')
export const podNode = new PodNode('/pod-nodes')
export const podGroup = new PODGroup('/pod-groups')
export const podNamespace = new PodNamespace('/pod-namespaces')
// 物理网元 链路
export const networkElement = new NetworkElement('/network-elements')
export const link = new Link('/links')
// 服务
export const podService = new PodService('/pod-services')
export const podServicePort = new PodServicePort('/pod-service-ports')
// 图标
export const icon = new Icon('/icons')
// 图例
export const legend = new Legend('/legends')
// 指标量
export const metric = new Metric('/metrics')
// 负载均衡资源组 -> 负载均衡
export const lb = new LB('/load-balance')
export const lbRule = new LBRule('/load-balance-rules')
// 子视图
export const subView = new SubView('/sub-views')
// 历史搜索
export const historySearch = new HistorySearch('/flowview/search-histories')
export const historySearchDefaultConfig =
  new HistorySearchDefaultConfig('/flowview/default-configs')
// 数据节点
export const dataSource = new DataSource('/data-sources')
export const domain = new API('/domains')
export const subDomain = new API('/sub-domains')
export const rdsInstance = new API('/rds')
export const redisInstance = new API('/redis')
export const podIngress = new API('/pod-ingress')
export const podReplicaSet = new API('/pod-replica-sets')
export const natgateway = new API('/netgateway')
// 网卡
export const vinterfaces = new API('/vinterfaces')
export const dhcpPort = new API('/dhcp')
export const peerConnect = new API('/peer-connect')
export const systemInfo = new API('/system/info')
