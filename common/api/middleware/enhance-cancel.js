import { GLOBAL_CANCEL_SOURCE_NAME } from "../const"

export default async (ctx, next) => {
  if (!ctx.req.cancelToken) {
    ctx.req.cancelToken = window[GLOBAL_CANCEL_SOURCE_NAME] && window[GLOBAL_CANCEL_SOURCE_NAME].token
  }
  await next()
}
