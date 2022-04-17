// import yamlConf from "../apiConfig"
// import ys from '../../js/ys.js'
// import {
//   error as alertError,
//   warning as alertWarning
// } from '../../js/alert.js'

/**
 * 记录API请求日志
 *
 * @name log
 * @function
 * @param {Object} config 请求参数
 * @param {string} comment 请求发起方描述
 */
// function log(config, comment) {
//   ys.log(`【${comment}】api request params =>\n`)
//   if (config.data && config.data.apitype === 'es') {
//     ys.log('url: ', config.data.url)
//     ys.log('param: ', JSON.stringify(config.data.data))
//   } else {
//     ys.log('url: ', config.url)
//     ys.log('param: ', JSON.stringify(config.data))
//   }
//   ys.log('\n')
// }

export default async (ctx, next) => {
  // log(ctx.req)
  await next()
  let isCancel = false
  ctx.req.cancelToken &&
    ctx.req.cancelToken.promise.then(res => {
      isCancel = true
    })
  ctx.res = ctx.res.catch(err => {
    // OPT_STATUS为success时不显示右上角错误提示框，会显示空
    if (err.OPT_STATUS === "SUCCESS") {
      return err
    }
    // const { tag = "" } = yamlConf[ctx.req?.yamlUrl]
    // // ys.log(err.OPT_STATUS, err.DATA, err.DESCRIPTION)
    // // 子视图不显示右上角的错误提示框
    // if (tag === "CHILD_VIEW") {
    //   if (err.OPT_STATUS === "PARTIAL_RESULT" || err.DESCRIPTION) {
    //     return Promise.reject(err)
    //   }
    // }
    // if (err.ERROR_MESSAGE) {
    //   alertError(err.ERROR_MESSAGE)
    // } else {
    //   // 超时显示黄色提示框
    //   if (err.OPT_STATUS === "REQUEST_TIMEOUT") {
    //     alertWarning(err.I18N)
    //   } else {
    //     // cancel掉的请求不显示警告提示
    //     if (!isCancel) {
    //       alertError(err.I18N)
    //     }
    //   }
    // }
    return Promise.reject(err)
  })
}
