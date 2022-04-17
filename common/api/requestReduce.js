import api from 'api'

let pendingRequests = {}

/*
 * HASH函数
 * @param  {String} s - 字符串
 * @return {String} hash值
 */
let hashGenrator = (s) => {
  let hash = 0
  if (s.length === 0) {
    return hash
  }
  for (let i = 0; i < s.length; i++) {
    let char = s.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash &= hash
  }
  return hash
}

/**
 * api Promise 装饰器
 * @param  {String} url         访问地址
 * @param  {Promise} p          Promise
 * @param  {Function} dataParse 数据处理函数
 * @return {None}
 */
let promisedDecorator = (url, p, dataParse) => {
  return p.then(data => {
    if (data.OPT_STATUS) {
      return dataParse(data.DATA)
    } else {
      ys.log(`获取${url}数据出错 data =》`, data)
      return Promise.reject(data)
    }
  })
    .catch(err => {
      ys.log(`获取${url}数据出错 err =》`, err)
      return Promise.reject(err)
    })
}


/**
 * 重复页面请求过滤
 * @param  {String} url       请求地址
 * @param  {Object} config    参数
 * @param  {Function} dataParse 返回数据处理函数
 * @return {None}
 */
export const duplicateRequestsFilter = (url, config, dataParse) => {
  if (config.method === 'get') {
    let identifier = hashGenrator(JSON.stringify(config))
    if (!_.has(pendingRequests, identifier)) {
      pendingRequests[identifier] = api(url, config).finally(() => {
        delete pendingRequests[identifier]
      })
    }
    return promisedDecorator(url, pendingRequests[identifier], dataParse)
  } else {
    return promisedDecorator(url, api(url, config), dataParse)
  }
}

module.exports = {
  duplicateRequestsFilter
}
