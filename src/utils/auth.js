import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const TokenKey = 'Authorization'

// 登录后保存token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 读取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 登出后删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 通过name读取值
export function getTokenByKey(key) {
  return Cookies.get(key)
}

export function setNameToToken(key, token) {
  return Cookies.set(key, token)
}

// 保存userId
export function setUserId(key, token) {
  return Cookies.set(key, token)
}
// 读取userId
export function getUserId(key) {
  return Cookies.get(key)
}
