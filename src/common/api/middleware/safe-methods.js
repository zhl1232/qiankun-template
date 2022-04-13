// import appConfig from 'appConfig'

const request = function(ctx) {
  if (appConfig.SAFE_METHOD) {
    let methods = ctx.req.method && ctx.req.method.toLowerCase()
    if (ctx && methods && methods !== 'get' && methods !== 'post') {
      Object.assign(ctx.req, {
        method: 'post',
        headers: {
          'real-method': methods
        }
      })
    }
  }
  return ctx
}

export default async(ctx, next) => {
  request(ctx)
  await next()
}
