import _ from 'lodash-es'
/**
 * 四舍五入数字为字符串，不足小数位的补零
 *
 * @name roundToStr
 * @function
 * @param {number} num 数字
 * @param {number} digits = 2 小数位数
 * @returns {string} 格式化后的字符串
 */
export function roundToStr(num, digits = 2) {
  if (digits < 0) {
    throw new Error('digits must greater than 0')
  }
  if (!_.isNumber(num) || _.isNaN(num)) {
    return num
  }
  const isMinusNum = num.toString().indexOf('-') > -1 // 是否是负数
  num = isMinusNum ? Math.abs(num) : num
  num *= 1 * Number(1 + Array(digits + 1).join('0'))
  num = Math.round(num) + ''
  let result = ''
  if (digits === 0) {
    result = num
  } else {
    // round后计算num位数是否小于digits,小于digits需要向前补零,避免slice丢失位数
    const count = digits + 1 - num.length
    num = (count > 0 ? Array(count + 1).join('0') : '') + num
    const integer = num.slice(0, -digits)
    const decimal = num.slice(-digits)
    result = integer + '.' + decimal
  }
  if (isMinusNum) {
    return Number('-' + result.toString())
  }
  return result
}

/**
 * 给数字加千分位
 *
 * @name numberToCommas
 * @function
 * @param {number} num  数字
 * @param {number} digits = 2 小数位数
 * @returns {string} 带逗号字符串
 */
export function numberToCommas(num, digits = 2) {
  if (!_.isNumber(num) || _.isNaN(num)) {
    return '--'
  }
  num = roundToStr(num, digits).toString().split('.')
  const newNum = num[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + (num.length > 1 ? '.' + num[1] : '')
  return newNum.toString().replace('.00', '')
}

/**
 * @brief roundToStrNotWithDecimalZero
 * <四舍五入后，若第二位小数为0，则保留一位小数>
 *
 * @param {string} num - 数据
 *
 * @returns
 */
function roundToStrNotWithDecimalZero(num) {
  let result = parseFloat(num)
  if (_.isNaN(result)) {
    logger.log('传递参数错误，请检查！', num)
    return false
  }
  result = Math.round(num * 100) / 100
  return result
}

/**
 * 将数字转化为带字节单位的字符串
 *
 * @name numberToShort
 * @function
 * @param {number} num 纯数字或纯数字字符串
 * @param {number} unit = 1000 进制单元
 * @param {number} digits = 2 小数位数
 * @returns {string} 带字节单位(K,M.G)的字符串
 */
export function numberToShort(num: string | number, unit = 1000, digits = 2) {
  const unitK = unit ** 2
  const unitM = unit ** 3
  const unitG = unit ** 4
  const unitT = unit ** 5
  let tmp = num === '' || num === null ? NaN : num
  tmp = _.toNumber(tmp) as number
  if (!_.isNaN(tmp)) {
    const abs = Math.abs(tmp)
    if (!_.isFinite(tmp)) {
      return tmp
    } else if (abs < unit) {
      return roundToStrNotWithDecimalZero(tmp) + ''
    } else if (abs < unitK) {
      return roundToStrNotWithDecimalZero(tmp / unit) + 'K'
    } else if (abs < unitM) {
      return roundToStrNotWithDecimalZero(tmp / unitK) + 'M'
    } else if (abs < unitG) {
      return roundToStrNotWithDecimalZero(tmp / unitM) + 'G'
    } else if (abs < unitT) {
      return roundToStrNotWithDecimalZero(tmp / unitG) + 'T'
    }
    return numberToCommas(tmp / unitT, digits) + 'P'
  }
  logger.log('格式化数字时，未传入纯数字', num)
  return num
}

/**
 * @returns {boolean} 是否是Chrome
 */
export function isChrome(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg') === -1) {
    const raw = userAgent.match(/chrom(e|ium)\/([0-9]+)\./)
    if (raw && Number(raw[2]) > 60) {
      return true
    }
    return false
  }
  return false
}

/**
 * element 动态换主题用
 *
 * @name toggleClass
 * @function
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {void}
 */
export function toggleClass(element: HTMLElement, className: string): void {
  if (!element || _.isUndefined(className)) {
    return
  }
  element.className = className
}
