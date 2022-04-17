// import {
//   authContext,
//   expirationTimeContext,
//   authHashContext
// } from 'base/context'
// import http from "ys-http-lib"
// import downloadMiddleware from 'ys-http-lib/src/middlewares/download'
// import authMiddleware from 'ys-http-lib/src/middlewares/authentication'
// import responseMiddleware from 'ys-http-lib/lib/middlewares/response'
// import safeMethodsMiddleware from "./safe-methods"
// import i18nMiddleware from "./i18n"
// import loggerMiddleware from "./logger"
// import specDownloadMiddleware from './spec-download'
// import apiConf from "../apiConfig"

// const send = http(
//   {
//     middlewares: [
//       loggerMiddleware,
//       // downloadMiddleware,
//       i18nMiddleware,
//       // responseMiddleware,
//       // specDownloadMiddleware,
//       // authMiddleware,
//       safeMethodsMiddleware
//     ]
//   },
//   apiConf
// )

// const srequest = (...args) => send(...args).then(data => data.DATA)

function checkLicense(response) {
  // response.then(rs => {
  // const hash = _.get(rs, ["headers", "license-hash"], "")
  // 获取哈希值与原来的进行比较，如果变了更新哈希值并下发api更新授权文件context
  // if (hash !== "" && hash !== authHashContext.current) {
  //   srequest("/license/file").then(license => {
  //     authHashContext.update(hash)
  //     authContext.update(license)
  //     const secondByDay = 60 * 60 * 24 // 一天多少秒
  //     const afterTime = license.AFTER_TIME
  //     let days = 0
  //     // 0.5天过期即还有一天过期，过期了-0.5天即过期一天
  //     if (afterTime > 0) {
  //       days = _.ceil(afterTime / secondByDay)
  //     } else if (afterTime < 0) {
  //       days = _.floor(afterTime / secondByDay)
  //     }
  //     expirationTimeContext.update(days)
  //   })
  // }
  // })
}

export default async (ctx, next) => {
  await next()
  checkLicense(ctx.res)
}
