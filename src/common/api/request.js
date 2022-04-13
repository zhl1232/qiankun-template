import { duplicateRequestsFilter } from './requestReduce.js'

const buildRequestCfg = (apitype, data, url, method) => {
  if (method.toLowerCase() === 'get' && data) {
    const params = []
    _.forEach(data, (value, key) => {
      params.push(key + '=' + encodeURIComponent(value))
    })
    url += (/\?/.test(url) ? '&' : '?') + params.join('&')
    data = ''
  }
  return {
    url,
    apitype,
    data,
    method
  }
}

export default (apitype, method, url, urlParams, dataParse = a => a) => () => {
  return duplicateRequestsFilter(url, buildRequestCfg(apitype, urlParams, url, method), dataParse)
}
