// import appConfig from 'appConfig'
import http from "ys-http-lib/src/index"
import downloadMiddleware from "ys-http-lib/src/export/download.js"
import authMiddleware from "./middleware/authentication.js"
import responseMiddleware from "./middleware/response.js"
import i18nMiddleware from "./middleware/i18n.js"
import loggerMiddleware from "./middleware/logger.js"
import specDownloadMiddleware from "./middleware/spec-download.js"
import licenseMiddleware from "./middleware/license.js"
// import safeMethodsMiddleware from './middleware/safe-methods.js'
import cancelMiddleware from "./middleware/enhance-cancel.js"
import yamlConf from "./apiConfig"
import _ from "lodash-es"

const API_TIMEOUT = 60 * 1000
const API_UPLOAD_TIMEOUT = 60 * 1000

const send = http(
  {
    middlewares: [
      loggerMiddleware,
      downloadMiddleware,
      i18nMiddleware,
      responseMiddleware,
      specDownloadMiddleware,
      licenseMiddleware,
      authMiddleware,
      // safeMethodsMiddleware,
      cancelMiddleware
    ],
    timeout: API_TIMEOUT
  },
  yamlConf
)

export const uploadRequest = (...args) => {
  if (args[1] && _.get(args[1], ["headers", "Content-Type"]) === "multipart/form-data") {
    args[1].timeout = API_UPLOAD_TIMEOUT
  }
  return send(...args).then(data => data)
}

export const srequest = (...args) => {
  if (args[1] && _.get(args[1], ["headers", "Content-Type"]) === "multipart/form-data") {
    args[1].timeout = API_UPLOAD_TIMEOUT
  }
  return send(...args).then(data => data.DATA)
}

export const genSingleApi = () => {
  let req = null
  return function (...args) {
    req = send(...args)
    return req
  }
}

export default send
