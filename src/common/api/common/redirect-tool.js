// 登出当前页面
export const logoutPage = () => {
  if (window.location.pathname.startsWith('/login')) return
  const path = encodeURIComponent(window.location.pathname) || ''
  const query = encodeURIComponent(window.location.search) || ''
  const hash = window.location.hash || ''
  window.location.href = `/login?&__path=[${path}]&__query=[${query}]${hash}`
}

// 登录页面
export const loginPage = () => {
  const search = decodeURIComponent(window.location.search)
  const pathReg = /&__path=\[(.*)\]&__query/g
  let path = pathReg.exec(search)
  path = path ? path[1] : '/'
  const queryReg = /&__query=\[(.*)\]$/g
  let query = queryReg.exec(search)
  query = query ? `${query[1]}` : ''
  const hash = window.location.hash || ''
  window.location.href = `${path}${query}${hash}`
}
