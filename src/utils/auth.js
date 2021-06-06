import Cookies from 'js-cookie'
import router from '@/router'

const TokenKey = 'Admin-TokenKey'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  removeToken();
  router.options.isAddDynamicMenuRoutes = false
}
