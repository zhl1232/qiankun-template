/**
 * @file    对elasticsearch封装
 * @author   biwenqing (wenqing@yunshan.net.cn)
 */

import request from './index.js'
import configs from './apiConfig/api.yaml'

const codeMap = {
  dfi_bw_usage_isp: [
    'tag.ip',
    'tag.epc_id',
    'tag.vlan_id',
    'tag.custom_tag_id',
    'tag.proto',
    'tag.port'
  ],
  dfi_bw_usage_isp_usage: [
    'tag.ip',
    'tag.epc_id',
    'tag.vlan_id',
    'tag.custom_tag_id',
    'tag.proto',
    'tag.port'
  ],
  dfi_bw_usage_vl2: [
    'tag.ip',
    'tag.device_id',
    'tag.device_type',
    'tag.vlan_id',
    'tag.subnet_id',
    'tag.custom_tag_id',
    'tag.epc_id',
    'tag.host',
    'tag.exporter',
    'tag.proto',
    'tag.port'
  ],
  dfi_visitor_geo: [
    'tag.direction',
    'tag.country',
    'tag.region',
    'tag.epc_id',
    'tag.ip',
    'tag.proto',
    'tag.port'
  ],
  dfi_conn_analyze: [
    'tag.direction',
    'tag.type',
    'tag.subtype',
    'tag.epc_id',
    'tag.ip',
    'tag.proto',
    'tag.port'
  ],
  dfi_flow_epc_flow_topo: [
    'tag.epc_id_0',
    'tag.epc_id_1',
    'tag.src_ip',
    'tag.dst_ip',
    'tag.exporter',
    'tag.vlan_id',
    'tag.group_id_0',
    'tag.group_id_1',
    'tag.whitelist_rule_id',
    'tag.l3_device_id_0',
    'tag.l3_device_type_0',
    'tag.l3_device_id_1',
    'tag.l3_device_type_1',
    'tag.l2_device_id_0',
    'tag.l2_device_type_0',
    'tag.l2_device_id_1',
    'tag.l2_device_type_1',
    'tag.allowed',
    'tag.proto',
    'tag.port'
  ],
  dfi_flow_platform: [
    'tag.exporter'
  ],
  dfi_flow_mac_liveness: [
    'tag.host',
    'tag.epc_id',
    'tag.mac',
    'tag.in_port_name'
  ],
  dfi_flow_arp_spoof: [
    'tag.epc_id',
    'tag.ip',
    'tag.mac'
  ],
  dfi_flow_service_log: [
    'tag.epc_id',
    'tag.server_ip',
    'tag.server_port',
    'tag.client_id'
  ],
  dfi_flow_ip_liveness: [
    'tag.epc_id',
    'tag.ip',
    'tag.masklen'
  ],
}


/**
 * 根据开始和结束时间，计算出需要查询的index名称
 * @param  {[object]} timestamp [开始、结束时间]
 * @return {[string]}           [url]
 */
function genESindexString(timestamp) {
  return request('/indexes', {
    urlQuery: {
      index_name: 'dfi_flow',
      start_time: timestamp.startTime,
      end_time: timestamp.endTime,
    }
  }, '获取index列表')
    .then(data => {
      return data.DATA.indexes.join(',')
    })
}

/**
 * 根据原始数据生成只包含timestamp的map
 *
 * @name getTimestampMap
 * @function
 * @param {Object} source 原始数据
 * @param {string} category hits or aggregation
 * @returns {Object} timestamp的map
 */
export function getTimestampMap(source, category) {
  let timestampMap = new Map()
  let warningOnce = true
  const timestampKey = category === 'hits' ? 'timestamp' : 'key_as_string'
  source = _.filter(source, item => {
    // 将此条数据的时间戳推入对应key的组
    let timestamp = item[timestampKey]
    if (timestamp) {
      timestamp = parseInt(timestamp)
      if (timestampMap.has(timestamp)) {
        // 有重复的时间戳
        if (warningOnce) {
          // 只提示一次
          ys.warning('统计数据异常，页面呈现结果过滤了异常值')
          ys.log(`原始数据中出现重复的时间戳, ${timestamp},data =>`, item)
        }
        warningOnce = false
        return false
      } else {
        timestampMap.set(timestamp, 1)
        return true
      }
    } else {
      ys.log('API缺失hits.timestamp|aggs.key_as_string字段', item)
      throw new Error('API缺失hits.timestamp|aggs.key_as_string字段')
    }
  })
  return {
    timestampMap,
    source,
  }
}

/**
 * 生成时间戳数组
 * 算法
 *  取出一个点的timestamp，
 *  根据startTime endTime，interval，
 *  分别向前，向后生成所有timestamp数组
 *
 * @name genFullTimestamp
 * @function
 * @param {number} originTime 补点的起始timestamp
 * @param {Object} timestamp timestamp对象
 * @returns {Array} 完备的数据戳数组
 */
export function genFullTimestamp(originTime, timestamp = {}) {
  if (!_.has(timestamp, 'startTime')) {
    throw new Error('timestamp.startTime is required')
  }
  if (!_.has(timestamp, 'endTime')) {
    throw new Error('timestamp.endTime is required')
  }
  if (!_.has(timestamp, 'intervalNum')) {
    throw new Error('timestamp.intervalNum is required')
  }
  const timestampList = []
  const interval = timestamp.intervalNum
  const start = timestamp.startTime
  const end = timestamp.endTime
  let preTimestamp = originTime - interval
  let nextTimestamp = originTime + interval
  timestampList.push(originTime)
  while (nextTimestamp <= end) {
    // 向后生成
    // 小于结束时间，生成结束前的所有时间戳
    // 最后一个点不计算
    timestampList.push(nextTimestamp)
    nextTimestamp += interval
  }
  while (preTimestamp >= start) {
    // 向前生成
    // 大于开始时间，生成开始后的所有时间戳
    timestampList.push(preTimestamp)
    preTimestamp -= interval
  }
  return timestampList
}

/**
 * 生成补点用的单条数据，timestamp索引
 *
 * @name genHitsTpl
 * @function
 * @param {Object} data 生成数据的模板
 * @param {number} timestamp 需要补点的timestamp
 * @param {boolean} zero 补0还是undefined
 * @returns {Object} 单条数据
 */
function genHitsTpl(data, timestamp, zero) {
  let tpl = _.cloneDeep(data)
  tpl.timestamp = timestamp
  const fillData = zero ? 0 : undefined
  // 擦除max数据
  tpl.max = _.mapValues(tpl.max, () => {
    return fillData
  })
  // 擦除sum数据
  tpl.sum = _.mapValues(tpl.sum, () => {
    return fillData
  })
  // 擦除min数据
  if (tpl.min) {
    tpl.min = _.mapValues(tpl.min, () => {
      return fillData
    })
  }
  // 对于模板数据，增加一个key:value=tpl:tpl
  tpl.template = fillData
  return tpl
}

/**
 * 生成补点用的单条数据，timestamp索引
 *
 * @name genAggsTpl
 * @function
 * @param {Object} data 生成数据的模板
 * @param {number} timestamp 需要补点的timestamp
 * @param {boolean} zero 补0还是undefined
 * @returns {Object} 单条数据
 */
function genAggsTpl(data, timestamp, zero) {
  let tpl = _.cloneDeep(data)
  // 删除单值部分，索引部分，方便擦除数据时的遍历
  delete tpl.key
  delete tpl.key_as_string
  delete tpl.doc_count
  // 擦除 value的值
  const fillData = zero ? 0 : undefined
  _.forEach(tpl, item => {
    item.value = fillData
  })
  // 回填删除的字段
  tpl.key = timestamp * 1000
  tpl.key_as_string = timestamp + ''
  tpl.doc_count = zero ? 0 : undefined
  // 对于模板数据，增加一个key:value=tpl:tpl
  tpl.template = fillData
  return tpl
}

/**
 * 填充缺失的timestamp对应的空值
 * 算法
 *  1、单个时间片有多个数据的需要进行分组，
 *     分组后使每组数据只要一条时间线，
 *  2、根据开始，结束，时间间隔，为相同的组生成完备的时间线
 *  3、为相同的组生成插值模板
 *  4、遍历所有组，对缺失的时间线在原始data中进行补点插值
 *
 * @name fillTimestamp
 * @function
 * @param {Object} data 格式化后的数据
 * @param {Object} timestamp 时间戳对象
 * @param {string} category hits or aggs
 * @returns {Array} 数据
 */
export function fillTimestamp(data, timestamp, category) {
  const { source, timestampMap } = getTimestampMap(data, category)
  const maxTimestamp = _.max([...timestampMap.keys()])
  const minTimestamp = _.min([...timestampMap.keys()])
  const timestampArr = genFullTimestamp(minTimestamp, timestamp)
  _.forEach(timestampArr, timestamp => {
    if (!timestampMap.has(timestamp)) {
      let zero = timestamp < maxTimestamp && timestamp > minTimestamp
      if (category === 'hits') {
        source.push(genHitsTpl(source[0], timestamp, zero))
      } else {
        source.push(genAggsTpl(source[0], timestamp, zero))
      }
    }
  })
  return source
}

/**
 * 分析查询语句，用于检错和缓存格式化response数据时的必要参数
 *
 * @name analyzeQuery
 * @function
 * @param {string} url api.yaml中的url
 * @param {Object} query 使用esKit生成的querybody
 * @returns {Object} 用于格式化response的数据
 */
function analyzeQuery(url, query) {
  // 将hits需要的field提取出来，用于格式化response的数据
  let field = '_source'
  if (url === '/es/flow') {
    field = 'fields'
  } else {
    // 对于其他表替换_code值
    let queryStr = JSON.stringify(query)
    const tags = queryStr.match(/tag\.((?!_code)+\w+)/g) || []
    let tableName = configs[url].url || ''
    tableName = tableName.match(/\w+(?=__<)/g) || []
    tableName = tableName[0]
    let keyMap = codeMap[tableName]
    let codeValue = 0
    _.forEach(tags, key => {
      let index = _.indexOf(keyMap, key)
      if (index === -1) {
        ys.log(`${tableName} tag fileds = [`, ...keyMap, `], not contain [${key}]`)
        throw new Error('elasticsearch query string has invalid key: ' + key)
      }
      codeValue |= 2 ** index
    })
    const codeStr = (queryStr.match(/_code":\d+/) || [])[0]
    if (codeStr) {
      // 替换 code
      // queryStr = queryStr.replace(/_code":\d+/g, `_code":${codeValue}`)
    } else {
      throw new Error('the query string must contain a substr {term:{tag._code: }}')
    }
    if (ys.debug) {
      ys.log('tablename => ', tableName, ', tag fileds => [', ...tags,
        `], [${codeStr}] replace to [_code":${codeValue}]`)
    }
    query = JSON.parse(queryStr)
  }
  // 标记aggregations结果中是否使用自动补充时间点。
  // 只对第一层聚合时是timestamp的补充，复杂格式需要自己补充，不能实现自动
  let aggTimestamp = true
  _.forEach(query.aggs, (agg, name) => {
    if (_.has(agg, 'terms')) {
      aggTimestamp = aggTimestamp && agg.terms.field === 'timestamp'
    }
    return !aggTimestamp
  })
  // 标记是否需要timestamp参数，当需要替换URL中的interval时必须。
  let needTimestamp = (configs[url].url || '').indexOf('<interval>') !== -1
  return {
    field,
    aggTimestamp,
    query,
    needTimestamp,
  }
}

/**
 * 格式化response的数据，减少嵌套层次，删除无用字段
 *
 * @name reduceData
 * @function
 * @param {Object} data raw elasticsearch data
 * @returns {Object} 格式化后的数据
 */
export function reduceData(data) {
  let result = {
    hits: [],
    aggregations: {},
    total: 0,
  }
  if (_.isEmpty(data)) {
    return result
  }
  // hits.total 是查询结果的总数，不应该跟 hits.hits 绑定
  if (data.hits) {
    result.total = data.hits.total
  }
  if (data.hits && data.hits.hits && !_.isEmpty(data.hits.hits)) {
    _.forEach(data.hits.hits, item => {
      // 提取hits._source或者fields字段
      const filed = _.has(item, 'fields') ? 'fields' : '_source'
      result.hits.push(item[filed])
    })
  }
  if (data.aggregations && !_.isEmpty(data.aggregations)) {
    let pickBucket = (data, result) => {
      _.forEach(data, (item, name) => {
        if (_.has(item, 'buckets')) {
          result[name] = item.buckets
          _.forEach(item.buckets, (bucket, index) => {
            pickBucket(bucket, result[name][index])
          })
        } else {
          result[name] = item
        }
      })
    }
    pickBucket(data.aggregations, result.aggregations)
  }
  return result
}

function genSearchData(url, params, comment, timestamp, options, autoFill) {
  return request(url, params, comment).then(data => {
    return reduceData(data.DATA, options)
  }).then(data => {
    if (autoFill) {
      if (!timestamp || !timestamp.intervalNum) {
        throw new Error('timestamp Object is required when autoFill is true')
      }
      // 只对hits或aggregations其中一个做补点
      if (!_.isEmpty(data.hits)) {
        data.hits = fillTimestamp(data.hits, timestamp, 'hits')
      } else {
        // 只对第一层聚合时bucket = timestamp的补点
        _.forEach(data.aggregations, (aggs, name) => {
          if (!_.isEmpty(aggs)) {
            if (options.aggTimestamp) {
              data.aggregations[name] = fillTimestamp(aggs, timestamp, 'aggs')
            }
          }
        })
      }
    }
    return data
  }).catch(err => {
    ys.error('网络请求发生错误')
    ys.log(err)
    return Promise.reject(err)
  })
}

/**
 * 生成查询API
 *
 * @name genSearch
 * @function
 * @param {string} url api.yaml中的url
 * @returns {Function} 查询API
 */
function genSearch(url) {
  return (query, timestamp, autoFill = false, comment = '') => {
    const options = analyzeQuery(url, query)
    const params = {
      data: options.query,
    }
    if (options.needTimestamp) {
      if (timestamp && timestamp.intervalStr) {
        params.urlQuery = {
          interval: timestamp.intervalStr,
        }
      } else {
        throw new Error('parameter timestamp.intervalStr is required')
      }
    }
    if (_.isString(autoFill) && comment === '') {
      comment = autoFill
    }
    if (timestamp && timestamp.startTime && timestamp.endTime && url === '/es/flow') {
      return genESindexString(timestamp).then(indexes => {
        params.url = `/${indexes}/_search`
        return genSearchData(url, params, comment, timestamp, options, autoFill)
      })
    } else {
      return genSearchData(url, params, comment, timestamp, options, autoFill)
    }
  }
}

export function esSimple(url, options, timestamp, category = 'aggs') {
  return request(url, options).then(ack => {
    let data = reduceData(ack.DATA)
    if (timestamp && _.isObject(timestamp)) {
      if (category === 'hits' && !_.isEmpty(data.hits)) {
        data.hits = fillTimestamp(data.hits, timestamp, 'hits')
      } else {
        _.forEach(data.aggregations, (aggs, name) => {
          if (!_.isEmpty(aggs)) {
            data.aggregations[name] = fillTimestamp(aggs, timestamp, 'aggs')
          }
        })
      }
    }
    return data
  })
}

export const wanSearch = genSearch('/es/wan')

export const wanUsageSearch = genSearch('/es/wan/usage')

export const lanSearch = genSearch('/es/lan')

export const epcSearch = genSearch('/es/epc')

export const flowSearch = genSearch('/es/flow')

export const platformSearch = genSearch('/es/platform')
