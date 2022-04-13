/* eslint-disable */

import request from './index';

export const ACCESS_TOKEN_LOCAL_STORAGE_NAME = 'access_token'
export const REFRESH_TOKEN_LOCAL_STORAGE_NAME = 'refresh_token'

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME)
}

export function getRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_NAME)
}

export function saveOAuthToken(data = {}) {
  const accessToken = data[ACCESS_TOKEN_LOCAL_STORAGE_NAME]
  accessToken && window.localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME, accessToken)
  const refreshToken = data[REFRESH_TOKEN_LOCAL_STORAGE_NAME]
  refreshToken && window.localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_NAME, refreshToken)
}

let refreshReq = null
export function refreshAccessToken() {
  if (!refreshReq) {
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_NAME)
    refreshReq = request('/accessToken/refresh', {
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }
    }, '刷新access token')
      .then(data => {
        setTimeout(() => {
          refreshReq = null
        }, 60000)
        return data
      }, err => {
        refreshReq = null
        return Promise.reject(err)
      })
  }
  return refreshReq
}

export function clearOAuthToken() {
  if (window.localStorage) {
    window.localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME)
    window.localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_NAME)
  }
}
