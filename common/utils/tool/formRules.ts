import validator from 'validator'
import validateColor from 'validate-color'
import _ from 'lodash-es'
// import { ip2int } from '../tool.js'
// IP to int
export function ip2int(ip: string) {
  const d = ip.split('.')
  return ((((+d[0] << 8) + +d[1]) << 8) + +d[2]) * 256 + +d[3]
}
/**
 * @brief numberRange  <整形数字的范围，应对0的场景>
 *
 * @param {Boolean} allowLeadingZero - 是否允许0开头的数字
 * @param {String | Number} min - 最小值
 * @param {String | Number} max - 最大值
 * @param {String} msg - 错误提示信息，默认返回 `范围min ~ max`
 * @returns
 */
function numberRange(params: { min: number; max?: number; msg?: string; allowLeadingZero?: boolean }) {
  const { min, max } = params
  const msg = params.msg ?? `范围 ${min} ~ ${max}`
  const allowLeadingZero = params.allowLeadingZero ?? false
  return {
    rule(param: string) {
      const rangObj: {
        allowLeadingZero?: boolean
        min?: number
        max?: number
      } = {}
      rangObj.allowLeadingZero = allowLeadingZero
      if (min ?? false) {
        rangObj.min = min
      }
      if (max ?? false) {
        rangObj.max = max
      }
      // isInt第一个参数必须是string类型
      const valid = validator.isInt(param + '', rangObj)
      return valid
    },
    msg
  }
}
const isIP = {
  rule(param: string) {
    const ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
    if (!ipv4Maybe.test(param)) {
      return false
    }
    const parts = param.split('.')
    if (parts.length !== 4) {
      return false
    }
    let isIP = true
    _.forEach(parts, part => {
      isIP = part === '0' || (part[0] !== '0' && ~~part > 0 && ~~part && ~~part <= 255) || false
      return isIP
    })
    return isIP
  },
  msg: '需要IPv4地址'
}

const isTapPort = {
  rule(param: string) {
    const reg = /^([0-9a-fA-F][0-9a-fA-F]:){3}([0-9a-fA-F][0-9a-fA-F])$/
    return (
      isIP.rule(param) ||
      reg.test(param) ||
      numberRange({
        min: 1,
        max: 2 ** 32 - 1,
        msg: '需要填入1到2^32的整数'
      }).rule(param)
    )
  },
  msg: '支持输入MAC后4字节（如01:23:45:67）、IPv4地址、正整数'
}

const isIPV6 = {
  rule(param: string) {
    // eslint-disable-next-line max-len
    return /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/.test(
      param
    )
  },
  msg: '需要IPv6地址'
}

const isAllIP = {
  rule(param: string) {
    return isIP.rule(param) || isIPV6.rule(param)
  },
  msg: '需要IPv4地址或IPv6地址'
}
const isIpWithMask = {
  rule(param: string) {
    const ipMask = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/
    if (!ipMask.test(param)) {
      return false
    }
    const parts = param.split('/')
    const ip = parts[0]
    const mask = parts[1]
    return isIP.rule(ip) && mask[0] !== '0' && ~~mask > 0 && ~~mask <= 32
  },
  msg: '需要带掩码的IPV4地址，如：10.10.10.0/24'
}

const isIpOnlyRange = {
  rule(param: string) {
    // eslint-disable-next-line max-len
    const ipRangeMask =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipRangeMask.test(param)
  },
  msg: '必须为IPV4段，如192.168.1.1-192.168.1.255'
}

const isIpv6OnlyRange = {
  rule(param: string) {
    const ips = _.split(param, '-')
    if (ips.length < 2) {
      return false
    }
    return !_.some(ips, ip => {
      return !isIPV6.rule(ip)
    })
  },
  msg: '必须为IPV6段，如ff06::a2-ff06::c4'
}

const isIpSplitWithComma = {
  rule(param: string) {
    const ips = _.split(param, ',')
    return !_.some(ips, ip => {
      return !isIP.rule(ip)
    })
  },
  msg: `需要IPv4地址，多个IP以','隔开`
}

const isIpv6SplitWithComma = {
  rule(param: string) {
    const ips = _.split(param, ',')
    return !_.some(ips, ip => {
      return !isIPV6.rule(ip)
    })
  },
  msg: `需要IPv6地址，多个IP以','隔开`
}

const isAllIpSplitWithComma = {
  rule(param: string) {
    const ips = _.split(param, ',')
    return !_.some(ips, ip => {
      return !isAllIP.rule(ip)
    })
  },
  msg: `需要IPV4或者IPV6地址，多个IP以','隔开`
}

const isIpWithMaskWithZero = {
  rule(param: string) {
    const ipMask = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/
    if (!ipMask.test(param)) {
      return false
    }
    const parts = param.split('/')
    const ip = parts[0]
    const mask = parts[1]
    if (isIP.rule(ip) && (mask === '0' || (mask[0] !== '0' && ~~mask > 0)) && ~~mask <= 32) {
      return true
    }
    return false
  },
  msg: '需要带掩码的IPV4地址，如：10.10.10.0/24'
}

const isIpv6WithMaskWithZero = {
  rule(param) {
    // eslint-disable-next-line max-len
    const regIpv6 =
      /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
    if (_.indexOf(param, '/') > -1) {
      const parts = param.split('/')
      const ip = parts[0]
      const mask = parts[1]
      if (regIpv6.test(ip) && (mask === '0' || (mask[0] !== '0' && ~~mask > 0)) && ~~mask <= 128) {
        return true
      }
      return false
    }
    return false
  },
  msg: '需要带掩码的IPV6地址，如：ff06::c4/10'
}

const isAllIpWithMaskWithZero = {
  rule(param: any) {
    return isIpWithMaskWithZero.rule(param) || isIpv6WithMaskWithZero.rule(param)
  },
  msg: '需要带掩码的IPV4地址或IPV6地址'
}

const isIpWithMaskSplitWithComma = {
  rule(param: string, type = 'v4') {
    const ips = param.split(',')
    const config =
      type === 'v4' // eslint-disable-line
        ? isIpWithMask
        : type === 'v6'
        ? isIpv6WithMaskWithZero
        : isAllIpWithMaskWithZero
    return !_.some(ips, ip => {
      return !config.rule(ip)
    })
  },
  msg(type = 'v4') {
    switch (type) {
      case 'v4': {
        return '需要带掩码的IPV4地址，如：10.10.10.0/24，多个网段以逗号隔开'
      }
      case 'v6': {
        return '需要带掩码的IPV6地址，如：ff06::c4/10，多个网段以逗号隔开'
      }
      default: {
        return '需要带掩码的IPV4或IPV6地址，多个网段以逗号隔开'
      }
    }
  }
}

const isAllIpOrAllIpWithMaskWithZero = {
  rule(param: any) {
    let valid = isAllIP.rule(param)
    if (!valid) {
      valid = isAllIpWithMaskWithZero.rule(param)
    }
    return valid
  },
  msg: '需要填入IPV4或者IPV6或者带掩码的IPV4地址或者带掩码的IPV6地址'
}

const isIpWithMask_31 = {
  rule(param: string) {
    const ipMask = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/
    if (!ipMask.test(param)) {
      return false
    }
    const parts = param.split('/')
    const ip = parts[0]
    const mask = parts[1]
    if (isIP.rule(ip) && mask[0] !== '0' && ~~mask > 0 && ~~mask < 32) {
      return true
    }
    return false
  },
  msg: '需要带掩码的IPV4地址，如：10.10.10.0/24，掩码必须小于32'
}

const isIPV6WithMask_127 = {
  rule(param) {
    // eslint-disable-next-line max-len
    const regIpv6 =
      /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
    if (_.indexOf(param, '/') > -1) {
      const parts = param.split('/')
      const ip = parts[0]
      const mask = parts[1]
      if (regIpv6.test(ip) && (mask === '0' || (mask[0] !== '0' && ~~mask > 0)) && ~~mask < 128) {
        return true
      }
      return false
    }
    return false
  },
  msg: '需要带掩码的IPV6地址，如：1234::/16，掩码必须小于128'
}

const isIpWithMask_31OrIPV6WithMask_127 = {
  rule(param: any) {
    return isIpWithMask_31.rule(param) || isIPV6WithMask_127.rule(param)
  },
  msg: '请输入网段，例如10.0.0.0/24或1234::/16，掩码不能等于最小值32或128'
}

const isIpOrIpWithMask = {
  rule(param: any) {
    let valid = isIP.rule(param)
    if (!valid) {
      valid = isIpWithMask.rule(param)
    }
    return valid
  },
  msg: '需要填入IPV4或者带掩码的IPV4地址，如：10.10.10.10或者10.10.10.10/24'
}

const isIpOrIpWithMaskExtend = {
  rule(param: { value: any }) {
    if (typeof param === 'object') {
      return isIpOrIpWithMask.rule(param.value)
    }
    return isIpOrIpWithMask.rule(param)
  },
  msg: isIpOrIpWithMask.msg
}

const isIpRange = {
  rule(param) {
    // eslint-disable-next-line max-len
    const rangeRule =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/[1-3]?[0-9]{1}$|^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    let valid = rangeRule.test(param)
    if (valid && _.indexOf(param, '/') > -1) {
      const arr = _.split(param, '/')
      const mask = arr[1]
      valid = ~~mask > 0 && ~~mask <= 32
    }
    return valid
  },
  msg: '必须为IP段，如10.20.30.2/24或192.168.1.100-192.168.200'
}

const isDomain = {
  rule(param: string) {
    // eslint-disable-next-line max-len
    const DomainRule = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
    return DomainRule.test(param)
  },
  msg: '必须为域名，如baidu.com'
}

const isIpOrDomain = {
  rule(param: any) {
    return isIP.rule(param) || isDomain.rule(param)
  },
  msg: '必须为域名或者IP，如baidu.com或者10.20.30.1'
}

const isAllIpOnlyRange = {
  rule(param: any) {
    if (isIpOnlyRange.rule(param)) {
      return true
    } else if (isIpv6OnlyRange.rule(param)) {
      return true
    }
    return false
  },
  msg: '请输入IP段格式且必须为相同类型的IP段，如x.x.x.x-x.x.x.x'
}

const isIpOnlyRangeWithComma = {
  rule(param: string) {
    const ips = param.split(',')
    const config = {
      rule(ip: any) {
        return isIpOnlyRange.rule(ip) || isIpv6OnlyRange.rule(ip) || false
      }
    }
    return !_.some(ips, ip => {
      return !config.rule(ip)
    })
  },
  msg: `输入有误。请输入IP段格式且必须为相同类型的IP段，如192.168.1.1-192.168.1.255`
}

// ipRange compare
const isIpRangeByOrder = {
  rule(param: string) {
    if (param.indexOf('-') > -1) {
      const ipRangeArr = param.split('-')
      const pre = ip2int(ipRangeArr[0])
      const bef = ip2int(ipRangeArr[1])
      return pre <= bef
    }
  },
  msg: 'IP段顺序需要从小到大'
}

// IP段且按大小顺序输入
const isIpRangeWithComma = {
  rule(param: any) {
    return isIpOnlyRangeWithComma.rule(param) && isIpRangeByOrder.rule(param)
  },
  msg: '需要填入IP段，如：192.168.1.100-192.168.1.200'
}

const isIpOnlyRangeSplitWithComma = {
  rule(param: string, type = 'v4') {
    const ips = param.split(',')
    const config =
      type === 'v4' // eslint-disable-line
        ? isIpOnlyRange
        : type === 'v6'
        ? isIpv6OnlyRange
        : {
            rule(ip: any) {
              return isIpOnlyRange.rule(ip) || isIpv6OnlyRange.rule(ip) || false
            }
          }
    return !_.some(ips, ip => {
      return !config.rule(ip)
    })
  },
  msg(type = 'v4') {
    switch (type) {
      case 'v4': {
        return '必须为IPV4段，如192.168.1.1-192.168.1.255，多个IP范围以逗号隔开'
      }
      case 'v6': {
        return '必须为IPV6段，如ff06::a2-ff06::c4，多个IP范围以逗号隔开'
      }
      default: {
        return '必须为IPV4或IPV6段，多个IP范围以逗号隔开'
      }
    }
  }
}

const isIpOrIpWithMaskOrIpRange = {
  rule(param: any) {
    return isIP.rule(param) || isIpWithMask.rule(param) || isIpRange.rule(param)
  },
  msg: '需要填入IPV4或者IP段，如：10.10.10.10、10.10.10.10/24、192.168.1.100-192.168.1.200'
}

// 支持0.0.0.0/0
const isZeroCidr = {
  rule(param: string) {
    const valid = _.trim(param) === '0.0.0.0/0'
    return valid
  },
  msg: '需要填入IPV4或者IP段，如：10.10.10.10、10.10.10.10/24、192.168.1.100-192.168.1.200'
}

const isIpOrIpWithMaskOrIpRangeAnd4Or6 = {
  rule(param: string) {
    return (
      isIP.rule(param) ||
      isIpWithMask.rule(param) ||
      isIpRangeWithComma.rule(param) ||
      isIPV6.rule(param) ||
      isIpv6WithMaskWithZero.rule(param) ||
      isIpv6OnlyRange.rule(param) ||
      isZeroCidr.rule(param)
    )
  },
  msg: '需要填入IP或者带掩码IP或者IP段，如：10.10.10.10、10.10.10.10/24、192.168.1.100-192.168.1.200'
}

const isIpOrIpWithMaskOrIpRangeAnd4Or6WithComma = {
  rule(param: string) {
    const ips = _.split(param, ',')
    return !_.some(ips, ip => {
      return !isIpOrIpWithMaskOrIpRangeAnd4Or6.rule(ip)
    })
  },
  msg: '支持输入多个IP、IP段、CIDR，例如: 2021::1, 1.2.3.4-1.2.3.6, 1.2.4.0/24'
}

function validPort(value: string, max: number, min: number) {
  let valid = false
  if (value.indexOf('-') > -1) {
    const portArr = value.split('-')
    if (portArr.length > 2) {
      return valid
    }
    const src = +portArr[0] * 1
    const dst = +portArr[1] * 1
    const srcValid = validator.isInt(src + '', {
      allow_leading_zeroes: false,
      min,
      max
    })
    const dstValid = validator.isInt(dst + '', {
      allow_leading_zeroes: false,
      min,
      max
    })
    valid = src <= dst && srcValid && dstValid
  } else {
    valid = validator.isInt(value + '', {
      allow_leading_zeroes: false,
      min,
      max
    })
  }
  return valid
}

const isPortWithComma = {
  rule(value: string) {
    value += ''
    const min = 0
    const max = 65535
    const reg = /^([1-9]\d*)([-,]([1-9]\d*))*$/
    const rst = value.match(reg)
    let valid = false
    if (rst) {
      if (value.indexOf(',') > -1) {
        const valueArr = value.split(',')
        _.forEach(valueArr, item => {
          valid = validPort(item, max, min)
          return valid
        })
      } else {
        valid = validPort(value, max, min)
      }
    }
    return valid
  },
  msg: '支持单端及端口组合输入，英文逗号分割，例如10,20,30,100-400'
}
const validSinglePort = {
  rule(value: string) {
    value += ''
    const min = 1
    const max = 65535
    const reg = /^([1-9]\d*)([-,]([1-9]\d*))*$/
    const rst = value.match(reg)
    let valid = false
    if (rst) {
      valid = validPort(value, max, min)
    }
    return valid
  },
  msg: '端口范围取值1 ~ 65535，例如：80,443,8080-8090'
}

const validSinglePortWithZero = {
  rule(value: string) {
    value += ''
    const min = 0
    const max = 65535
    const reg = /^([0-9]\d*)([-,]([0-9]\d*))*$/
    const rst = value.match(reg)
    let valid = false
    if (rst) {
      valid = validPort(value, max, min)
    }
    return valid
  },
  msg: '端口范围取值0 ~ 65535，例如：80,443,8080-8090'
}

const longPort100 = {
  rule(value: string) {
    let valid = true
    if (value.indexOf(',') > -1) {
      const portArr = value.split(',')
      if (portArr.length > 100) {
        valid = false
      }
    }
    return valid
  },
  msg: '输入过长，请不要超过100段'
}

const maxPortCount100 = {
  rule(value: string) {
    const min = 1
    const max = 65535
    const MAXCOUNT = 100
    const bitMap = {}
    for (let i = min; i < max; i++) {
      bitMap[i] = 0
    }
    if (value.indexOf(',') > -1) {
      const valueArr = value.split(',')
      _.forEach(valueArr, item => {
        if (item.indexOf('-') > -1) {
          const portArr = item.split('-')
          const src = +portArr[0] * 1
          const dst = +portArr[1] * 1
          for (let i = src; i <= dst; i++) {
            bitMap[i] += 1
          }
        } else {
          item = (+item * 1).toString()
          bitMap[item] += 1
        }
      })
    } else {
      if (value.indexOf('-') > -1) {
        const portArr = value.split('-')
        const src = +portArr[0] * 1
        const dst = +portArr[1] * 1
        for (let i = src; i <= dst; i++) {
          bitMap[i] += 1
        }
      } else {
        value = (+value * 1).toString()
        bitMap[value] += 1
      }
    }
    const portCount = _.reduce(
      bitMap,
      (result, value) => {
        if (value > 0) {
          result += 1
        }
        return result
      },
      0
    )
    return portCount <= MAXCOUNT
  },
  msg: '端口号数量不能超过100个'
}
const isPortOrPortRangeWithComma = {
  rule(value: string) {
    value += ''
    const min = 1
    const max = 65535
    const reg = /^([1-9]\d*)([-,]([1-9]\d*))*$/
    const rst = value.match(reg)
    let valid = false
    if (rst) {
      if (value.indexOf(',') > -1) {
        const valueArr = value.split(',')
        _.forEach(valueArr, item => {
          valid = validPort(item, max, min)
          return valid
        })
      } else {
        valid = validPort(value, max, min)
      }
    }
    return valid
  },
  msg: '端口范围取值1 ~ 65535，逗号和连字符使用英文半角，例如：80,443,8080-8090'
}

function required(value: string) {
  if (value === null || value === undefined) {
    return false
  }
  return /\S/.test(value)
}

// 区域输入网段
const allIpWithMaskWithZero = {
  rule(param: any) {
    return isIpWithMaskSplitWithComma.rule(param, 'all')
  },
  msg: '请输入网段，例如10.0.0.0/24或1234::/16，多个IP范围以逗号隔开'
}

const numberAndUnit = {
  rule(value: string) {
    return /^[1-9]+[0-9]*[k,g,m,t]{0,1}$/i.test(value) || Number(value) === 0
  },
  msg: '输入数字，支持整数和K,G,M,T单位，如100K, 10G'
}

const timeNumberAndUnit = {
  rule(value: string) {
    return /^[1-9]+[0-9]*[ms,s]{0,2}$/i.test(value) || Number(value) === 0
  },
  msg: '输入数字，支持整数和ms,s单位，如100ms, 10s'
}

const widthWithUnit = {
  rule(value: string) {
    return /^[0-9]+(px|%){0,1}$/i.test(value) || Number(value) === 0
  },
  msg: '可以输入数字，数字 + px（像素），数字 + %'
}

/**
 * 定制规则列表，根据validate函数决定使用正则或函数
 */
const rules = {
  analyzerVtapMaxRange: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 10000,
    msg: '需要填入1到10000的整数'
  }),
  bandWidth: numberRange({
    allowLeadingZero: false,
    min: 0,
    msg: '带宽必须是整数，0代表不限制'
  }),
  bandwidthRange2048: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 2048,
    msg: '带宽最多2048Mb'
  }),
  flowRange10000: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 10000,
    msg: '需要填入0到10000的整数'
  }),
  flowRangeBillion: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 1000000000,
    msg: '需要填入0到十亿的整数'
  }),
  ipRange10: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 10,
    msg: 'IP最多10个'
  }),
  intMin1: numberRange({
    allowLeadingZero: false,
    min: 1,
    msg: '>=1的整数'
  }),
  isEmails: {
    rule(input: string, max: number) {
      const arr = input.split(';')
      if (typeof max === 'number' && arr.length > max) {
        return false
      }
      let valid = true
      _.forEach(arr, mail => {
        if (!validator.isEmail(mail)) {
          valid = false
          return false
        }
      })
      return valid
    },
    msg(max: any) {
      if (typeof max === 'number') {
        return `请输入正确的邮箱格式，多个邮箱之间用英文半角分号隔开，最多支持${max}个邮箱`
      }
      return `请输入正确的邮箱格式，多个邮箱之间用英文半角分号隔开`
    }
  },
  isEmailsComma: {
    rule(input: string, max: number) {
      const arr = input.split(',')
      if (typeof max === 'number' && arr.length > max) {
        return false
      }
      if (new Set(_.map(arr, mail => mail.trim())).size !== arr.length) {
        return false
      }
      let valid = true
      _.forEach(arr, mail => {
        if (!validator.isEmail(mail)) {
          valid = false
          return false
        }
      })
      return valid
    },
    msg(max: any) {
      if (typeof max === 'number') {
        return `请输入正常的邮箱格式，多个邮箱用英文半角逗号隔开，最多支持${max}个邮箱，不能重复`
      }
      return `请输入正常的邮箱格式，多个邮箱用英文半角逗号隔开，不能重复`
    }
  },
  isEmail: {
    msg: '请输入正确的邮箱格式'
  },
  isIn: {
    msg: '数据不在备选范围内'
  },
  isInt: {
    msg: '必须是数字'
  },
  isIP,
  isIpOrIpWithMask,
  isIpOrIpWithMaskExtend,
  isIpRange,
  isIpOnlyRange,
  isIpRangeOrWithMask: {
    // eslint-disable-next-line max-len
    rule: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/[1-3]?[0-9]{1}$|^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    msg: '必须为IP段，如10.20.30.2/24或192.168.1.100-192.168.200'
  },
  isIpWithMask,
  isIpSplitWithComma,
  isIpWithMaskSplitWithComma,
  isIpOnlyRangeWithComma,
  isIpOnlyRangeSplitWithComma,
  isIpWithMaskWithZero,
  isIpWithMaskRange8_32: {
    // eslint-disable-next-line max-len
    rule: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?){1}\/([8,9]|[1,2]\d|3[0-2]){1}$/,
    msg: '需要带掩码的IPV4地址，如：10.10.10.0/24，其中，子网掩码为8到32'
  },
  isIpRangeByOrder,
  isIpWithMask_31,
  isIPV6WithMask_127,
  isIpWithMask_31OrIPV6WithMask_127,
  isNetMaskLength: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 32,
    msg: '掩码长度为1-32'
  }),
  isNetMaskLength_128: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 128,
    msg: '掩码长度为1-128'
  }),
  isIpOrIpWithMaskOrIpRange,
  isIpOrIpWithMaskOrIpRangeAnd4Or6,
  isIpOrIpWithMaskOrIpRangeAnd4Or6WithComma,
  isPhone: {
    rule: ['isMobilePhone', 'zh-CN'],
    msg: '请输入正确的电话号码'
  },
  isPort: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 65535
  }),
  isLdapServerPort: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 65534
  }),
  isMin0Int: numberRange({
    allowLeadingZero: false,
    min: 0,
    msg: '请输入大于0整数'
  }),
  isCustomPort: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 65535,
    msg: '范围 1~65535'
  }),
  isPortRange: isPortOrPortRangeWithComma,
  isPortWithComma,
  isPortOrPortRangeWithComma,
  maxPortCount100,
  longPort100,
  isPositiveInt: numberRange({
    allowLeadingZero: false,
    min: 0,
    msg: '请输入非负整数'
  }),
  isVlan: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 4094,
    msg: '需要填入VLAN，范围 1 ~ 4094'
  }),
  isVlanId: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 4095,
    msg: '范围 0 ~ 4095'
  }),
  isVni: numberRange({
    allowLeadingZero: true,
    min: 0,
    max: 16000000,
    msg: '需要填入VNI范围，0 ~ 16000000'
  }),
  isMACAddress: {
    msg: 'MAC地址格式为:74:E5:43:57:82:52'
  },
  // 汉字Unicode范围参考:https://blog.csdn.net/xiatiancc/article/details/82020094
  name: {
    rule: /^.{1,64}$/,
    msg: '请输入64位以内可打印字符'
  },
  xmlFolder: {
    rule: /^.{0,100}$/,
    msg: '可输入长度为0-100的字符串'
  },
  description: {
    rule: /^[\da-zA-Z\u4E00-\u9FA5\u9FA6-\u9FEF_.-]{1,200}$/,
    msg: '只能包括中文、英文、数字、下划线、横线、小数点，且最大长度为200个字符'
  },
  // nameEn: {
  //   rule: /^[\da-zA-Z_-]{1,64}$/,
  //   msg: '只能包括英文、数字、下划线、横线，且最大长度为64个字符',
  // },
  // normalChar: {
  //   rule: /^[\da-zA-Z\u4E00-\u9FA5\u9FA6-\u9FEF_.-]+$/,
  //   msg: '只能包括中文、英文、数字、下划线、横线、小数点',
  // },
  // normalCharName: {
  //   rule: /^[\da-zA-Z\u4E00-\u9FA5\u9FA6-\u9FEF_.-]{1,64}$/,
  //   msg: '只能包括中文、英文、数字、下划线、横线、小数点，且最大长度为64个字符',
  // },
  // range40TagName: {
  //   rule: /^[\da-zA-Z\u4E00-\u9FA5\u9FA6-\u9FEF_-]{1,40}$/,
  //   msg: '只能包括中文、英文、数字、下划线、横线，且最大长度为40个字符',
  // },
  // remark: {
  //   rule: /^.{1,256}$/,
  //   msg: '最大长度为256个字符',
  // },
  // tapName: {
  //   rule: /^.{0,32}$/,
  //   msg: '最大长度为32个字符',
  // },
  npbPayload: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 65535
  }),
  flowlogId: {
    rule: /^\d{1,1500}$/,
    msg: '可输入长度为1-1500的数字'
  },
  clientServer: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 65535,
    msg: '只支持整形数字输入，端口号范围0-65535'
  }),
  password: {
    rule: /^[\da-zA-Z]{8,16}$/,
    msg: '只包括数字或字母，8-16个符'
  },
  portOrPortRange: {
    // eslint-disable-next-line max-len
    rule: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$|^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])-([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
    msg: '端口范围，如80，或者2000-3000，最大值65535'
  },
  protocolPortsRange: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 255,
    msg: '端口范围为0-255'
  }),
  range10: {
    rule: [
      'isLength',
      {
        min: 0,
        max: 10
      }
    ],
    msg: '最多10字符'
  },
  range20: {
    rule: [
      'isLength',
      {
        min: 0,
        max: 20
      }
    ],
    msg: '最多20字符'
  },
  range50: {
    rule: [
      'isLength',
      {
        min: 0,
        max: 50
      }
    ],
    msg: '最多50字符'
  },
  range64: {
    rule: [
      'isLength',
      {
        min: 0,
        max: 64
      }
    ],
    msg: '最多64字符'
  },
  range128: {
    rule: [
      'isLength',
      {
        min: 0,
        max: 128
      }
    ],
    msg: '最多128字符'
  },
  range255: {
    rule: [
      'isLength',
      {
        min: 0,
        max: 255
      }
    ],
    msg: '最多255字符'
  },
  range500: {
    rule: [
      'isLength',
      {
        min: 0,
        max: 500
      }
    ],
    msg: '最多500字符'
  },
  required: {
    rule: required,
    msg: '必填'
  },
  tcpdumpPacket: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 10000,
    msg: '需要输入1-10000的数字'
  }),
  tcpdumpTimeout: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 600,
    msg: '需要填入1-600的数字'
  }),
  // required 变个 msg
  requiredNotAllEmpty: {
    rule: required,
    msg: '源或目的资源组不可同时为空'
  },
  isRepeat: {
    rule() {
      return false
    },
    msg: '不能包含重复项'
  },
  rangeFrom0To10to15thPower: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 10 ** 15,
    msg: '[0, 1e15]之间的整数'
  }),
  rangeFrom1To10to15thPower: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 10 ** 15,
    msg: '[1, 1e15]之间的整数'
  }),
  intbigthan1: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 1000000000,
    msg: '需要输入大于1的数字,最大1000000000'
  }),
  intbigthan512: numberRange({
    allowLeadingZero: false,
    min: 512,
    max: 1000000000,
    msg: '需要输入大于512的数字，最大1000000000'
  }),
  intbigthan60: numberRange({
    allowLeadingZero: false,
    min: 60,
    max: 1000000000,
    msg: '需要输入大于60的数字，最大1000000000'
  }),
  vtapPayLoadLength: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 65535,
    msg: '需要输入大于0的数字，最大65535'
  }),
  vtapConfigKpps: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 10 ** 6,
    msg: '范围 1 ~ 1000000'
  }),
  vtapConfigCpu: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 10 ** 5,
    msg: '范围 1 ~ 100000'
  }),
  vtapConfigMaxTxBandwidth: numberRange({
    allowLeadingZero: true,
    min: 0,
    max: 10000,
    msg: '范围 0 ~ 10000'
  }),
  vtapLogThreshold: numberRange({
    allowLeadingZero: true,
    min: 0,
    max: 10000
  }),
  logRention: numberRange({
    allowLeadingZero: true,
    min: 7,
    max: 365
  }),
  l7LogPacketSize: numberRange({
    allowLeadingZero: true,
    min: 256,
    max: 1500
  }),
  l4LogCollectNpsThreshold: numberRange({
    allowLeadingZero: true,
    min: 100,
    max: 1000000
  }),
  l7LogCollectNpsThreshold: numberRange({
    allowLeadingZero: true,
    min: 100,
    max: 1000000
  }),
  vtapConfigBandwidthProbeInterval: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 60
  }),
  vtapConfigMem: numberRange({
    allowLeadingZero: false,
    min: 128,
    max: 10 ** 5,
    msg: '范围 128 ~ 100000'
  }),
  vtapConfigSyncInterval: numberRange({
    allowLeadingZero: false,
    min: 10,
    max: 3600
  }),
  vtapConfigNbpmbps: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 10 ** 4,
    msg: '范围 1 ~ 10000'
  }),
  cloudSyncTime: numberRange({
    allowLeadingZero: false,
    min: 60,
    max: 3600,
    msg: '60-3600之间的整数'
  }),
  influxdbRpDuration: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 1000,
    msg: '1-1000之间的整数'
  }),
  alarmStrategyPercent: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 100,
    msg: '1~100的整数'
  }),
  alarmStrategyDuration: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 10,
    msg: '1~10的整数'
  }),
  isIPV4: isIP,
  isIPV6,
  isAllIP,
  isIpv6SplitWithComma,
  isAllIpSplitWithComma,
  pcapPayLoadLength: numberRange({
    allowLeadingZero: true,
    min: 0,
    max: 65535,
    msg: '范围为0~65535的整数'
  }),
  isIpv6OnlyRange,
  isIpv4OnlyRange: isIpOnlyRange,
  isAllIpOnlyRange,
  isIpv4WithMaskWithZero: isIpWithMaskWithZero,
  isIpv6WithMaskWithZero,
  isAllIpWithMaskWithZero,
  isAllIpOrAllIpWithMaskWithZero,
  widthWithUnit,
  // nameByLen8: {
  //   rule: /^[\da-zA-Z\u4E00-\u9FA5\u9FA6-\u9FEF_-]{1,8}$/,
  //   msg: '只能包括中文、英文、数字、下划线、横线，且最大长度为8个字符',
  // },
  // nameByLen16: {
  //   rule: /^[\da-zA-Z\u4E00-\u9FA5\u9FA6-\u9FEF_-]{1,16}$/,
  //   msg: '只能包括中文、英文、数字、下划线、横线，且最大长度为16个字符',
  // },
  // nameByLen32: {
  //   rule: /^[\da-zA-Z\u4E00-\u9FA5\u9FA6-\u9FEF_-]{1,32}$/,
  //   msg: '只能包括中文、英文、数字、下划线、横线，且最大长度为32个字符',
  // },
  isIpOrDomain,
  // 关键服务端口
  keyServicePorts: {
    rule(input: string) {
      const portReg = /\b[0-9]+\b/g
      let validPort = true
      _.forEach(input.match(portReg), port => {
        if (parseInt(port, 10) < 1 || parseInt(port, 10) > 65535) {
          validPort = false
          return false
        }
      })
      // eslint-disable-next-line
      const reg = /^((\b(tcp)\b)|(\b(udp)\b)):(\d+|(\d+-\d+))(,(\d+|(\d+-\d+)))*$/i
      return validPort && !_.some(input.split(';'), value => !reg.test(value))
    },
    msg: '协议+端口形式，例如TCP:22或TCP:22-30或TCP:22,8080-8082 多组协议+端口之间用半角分号，例如TCP:22;UDP:21'
  },
  isLongtitude: {
    // eslint-disable-next-line
    rule: /^[\-\+]?(0(\.\d{1,4})?|([1-9](\d)?)(\.\d{1,4})?|1[0-7]\d{1}(\.\d{1,4})?|180(\.0{1,4})?)$/,
    msg: '范围-180~180，最多允许输入四位小数'
  },
  isLatitude: {
    // eslint-disable-next-line no-useless-escape
    rule: /^[\-\+]?((0|([1-8]\d?))(\.\d{1,4})?|90(\.0{1,4})?)$/,
    msg: '范围-90~90，最多允许输入四位小数'
  },
  allIpWithMaskWithZero,
  interfaceIndex: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 2 ** 32 - 1,
    msg: '范围 1~2^32-1'
  }),
  validSinglePort,
  validSinglePortWithZero,
  numberAndUnit,
  timeNumberAndUnit,
  dataSourceName: {
    rule: /^[\da-zA-Z_]{1,10}$/,
    msg: '只能包括英文、数字、下划线，且最大长度为10个字符'
  },
  longEscapeTime: numberRange({
    allowLeadingZero: false,
    min: 600,
    max: 2592000,
    msg: '范围 600 ~ 2592000'
  }),
  UDP_MTU: numberRange({
    allowLeadingZero: false,
    min: 500,
    max: 10000,
    msg: '范围 500 ~ 10000'
  }),
  UDP_VLAN: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 4095,
    msg: '范围 0 ~ 4095'
  }),
  CAPTURE_PACKET_SIZE: numberRange({
    allowLeadingZero: false,
    min: 128,
    max: 65535
  }),
  isColor: {
    rule: validateColor,
    msg: '请输入正确的颜色'
  },
  isTapPort,
  isTunnelId: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 4096
  }),
  isFlowLogName: {
    rule: /^.{1,128}$/,
    msg: '请输入128位以内可打印字符'
  },
  isHttpRequestId: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 4294967294
  }),
  isHttpTraceId: {
    rule: /^.{1,1500}$/,
    msg: '请输入1500位以内可打印字符'
  },
  isHttpCode: {
    rule: /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/,
    msg: '支持单数字及组合输入，英文逗号分割，例如200,500-599'
  },
  isDnsId: numberRange({
    allowLeadingZero: false,
    min: 0,
    max: 4294967294
  }),
  isDnsDomain: {
    rule: /^.{1,128}$/,
    msg: '请输入128位以内可打印字符'
  },
  isDnsAnswerAddr: {
    rule: /^.{1,128}$/,
    msg: '请输入128位以内可打印字符'
  },
  THREAD_THRESHOLD: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 1000
  }),
  PROCESS_THRESHOLD: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 100
  }),
  CAPTURE_BPF: {
    rule: [
      'isLength',
      {
        min: 1,
        max: 512
      }
    ],
    msg: '长度范围[1, 512]'
  },
  FLOW_VIEW_NUMBER: numberRange({
    allowLeadingZero: false,
    min: 1,
    max: 65535,
    msg: '范围 1 ~ 65535任意数字'
  }),
  FLOW_VIEW_STRING: {
    rule: [
      'isLength',
      {
        min: 1,
        max: 1500
      }
    ],
    msg: '范围1 ~ 1500字符'
  }
}

/**
 * 适用于 antdV 表单验证
 *
 * @export
 * @param {string} ruleName
 * @returns function(rule, value, callback)
 */
export function antdValidate(ruleName: string) {
  if (ruleName in rules) {
    return (rule: any, value) => {
      const valid = rules[ruleName].rule(value)
      if (valid) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(rules[ruleName].msg))
    }
  } else {
    logger.error(`没有定义${ruleName}验证规则`)
  }
}

export default rules
