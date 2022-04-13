import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken } from "../common/token"
import { logoutPage } from "../common/redirect-tool"

const AUTH_EXPIRE_STATUS = ["EXPIRED_TOKEN", "INVALID_TOKEN", "INVALID_TOKEN_FORMAT", "AUTH_HEADER_ERROR"]

let refreshReq = null
const refreshToken = send => {
  if (!refreshReq) {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return Promise.reject(new Error("refresh token不存在！"))
    }
    refreshReq = send(
      "/refresh_token",
      {
        apitype: "auth",
        method: "post",
        data: {
          grant_type: "refresh_token",
          refresh_token: refreshToken
        }
      },
      "刷新access token"
    ).finally(() =>
      setTimeout(() => {
        refreshReq = null
      }, 60000)
    )
  }
  return refreshReq
}

const addAuthHeader = ctx => {
  if (!ctx.req.headers) ctx.req.headers = {}
  const accessToken = getAccessToken()
  if (accessToken) {
    ctx.req.headers.Authorization = `Bearer ${accessToken}`
  }
}

const checkAuthState = (ctx, reSender) => {
  ctx.res = ctx.res
    .then(res => {
      // 如果是刷新token的请求，则做保存操作
      if (ctx.req.app === "auth" && ctx.req.url.endsWith("/refresh_token")) {
        const data = (res.data && res.data.DATA) || {}
        setAccessToken(data.access_token)
        setRefreshToken(data.refresh_token)
      }
      return res
    })
    .catch(error => {
      if (error && error.response && error.response.status === 401) {
        const data = error.response.data || {}
        // 如果access_token过期、不合法等情况，尝试用refresh_token刷新
        if (AUTH_EXPIRE_STATUS.includes(data.OPT_STATUS)) {
          // 刷新成功则重新请求，否则跳转登录页
          return refreshToken(ctx.send)
            .catch(() => {
              logoutPage()
              return Promise.reject(error)
            })
            .then(reSender)
            .then(() => ctx.res)
        }
      }
      return Promise.reject(error)
    })
}

// response响应处理中间件
export default async (ctx, next) => {
  const reSender = async () => {
    addAuthHeader(ctx)
    await next()
  }
  await reSender()
  checkAuthState(ctx, reSender)
}
