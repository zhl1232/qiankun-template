import { logoutPage } from '../common/redirect-tool'
// import {
//   authFileContext,
//   needJumpLicenseContext,
//   userTypeContext,
// } from 'base/context'

// 处理 http code 2xx 应答
const handleSuccess = response => {
  const data = response.data
  let result = {
    OPT_STATUS: 'SUCCESS',
    DATA: null
  }
  if (data === '') {
    result.OPT_STATUS = 'NONE_ANSWER'
  } else if (typeof data === 'object' && 'OPT_STATUS' in data) {
    result = data
  } else {
    result.DATA = data
  }
  if (result.OPT_STATUS === 'REDIRECT') {
    if (result.LOCATION) {
      window.location.href = result.LOCATION
    } else {
      return logoutPage()
    }
  }
  return result
}

// 处理 http code >= 300 应答
function handleError(error) {
  let result = {
    OPT_STATUS: 'DEFAULT',
    DATA: []
  }
  if (error?.__CANCEL__) {
    result.OPT_STATUS = 'REQUEST_CANCELED'
    return Promise.resolve(result)
  } else if (error.code === 'ECONNABORTED') {
    result.OPT_STATUS = 'REQUEST_TIMEOUT'
  } else if (error.response) {
    const data = error.response.data
    const status = error.response.status
    // needJumpLicenseContext.update(false)
    if (status === 402) {
      // 没有授权文件或者授权文件验证失败
      // if (userTypeContext?.current?.isTenant) {
      //   logoutPage()
      // } else {
      //   authFileContext.update(false)
      //   needJumpLicenseContext.update(true)
      // }
    }
    if (typeof data === 'object' && 'OPT_STATUS' in data) {
      result = data
    } else {
      const status = error.response.status
      const statusText = error.response.statusText
      result.OPT_STATUS = `【${status}】${statusText}`
    }
  }
  return Promise.reject(result)
}

// response响应处理中间件
export default async (ctx, next) => {
  await next()
  ctx.res = ctx.res.then(handleSuccess, handleError)
}
