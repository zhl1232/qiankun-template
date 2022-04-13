import STATUS from "../status.js"
import { get, isString, has, includes, reduce } from "lodash-es"
// 这些app不读status里的翻译
const EXCLUDE_APP_LIST = ["fauths", "fuser", "df-web", "web-tools"]

function i18n(request, response, reason) {
  const curApp = get(request, "app")
  const i = "CH" // 语言环境
  if (isString(reason)) {
    response.I18N = reason || STATUS.DEFAULT[i]
  } else {
    const status = response.OPT_STATUS
    if (status === STATUS.SUCCESS.SELF || status === true || status === 1) {
      response.OPT_STATUS = STATUS.SUCCESS.SELF
      response.I18N = STATUS.SUCCESS[i]
    } else if (has(STATUS, status) && !includes(EXCLUDE_APP_LIST, curApp)) {
      const reg = /\((\w+):\s(.+?)\)/g
      const msgs = []
      let result = reg.exec(response.DESCRIPTION)
      while (result) {
        let [, key, value] = result
        const msg = STATUS[status][key.toUpperCase() + `_${i}`]
        if (STATUS[status][key.toUpperCase() + `_DICT_${i}`]) {
          value = STATUS[status][key.toUpperCase() + `_DICT_${i}`][value]
        }
        if (msg) {
          msgs.push(msg.replace(`<${key}>`, value))
        }
        result = reg.exec(response.DESCRIPTION)
      }
      response.I18N = reduce(msgs, (r, msg) => r + msg, STATUS[status][i])
    } else {
      response.I18N = response.OPT_STATUS_CH || response.DESCRIPTION || STATUS.DEFAULT[i]
    }
  }
  return response
}

export default async (ctx, next) => {
  await next()
  ctx.res = ctx.res.then(
    e => {
      return i18n(ctx.req, e)
    },
    e => Promise.reject(i18n(ctx.req, e))
  )
}
