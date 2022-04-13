class MockStorage {
  constructor() {
    this.map = new Map()
  }

  getItem(k) {
    return this.map.get(k)
  }

  setItem(k, v) {
    this.map.set(k, v)
  }

  removeItem(k) {
    this.map.delete(k)
  }
}

const ACCESS_TOKEN_LOCAL_STORAGE_NAME = 'access_token'
const REFRESH_TOKEN_LOCAL_STORAGE_NAME = 'refresh_token'

const localStorage = typeof window !== 'undefined' ? window.localStorage : new MockStorage()

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME)
}

export function setAccessToken(token) {
  return localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME, token)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_NAME)
}

export function setRefreshToken(token) {
  return localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_NAME, token)
}

export function clearOAuthToken() {
  if (localStorage) {
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME)
    localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_NAME)
  }
}
