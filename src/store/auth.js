import Cookies from 'js-cookie'

export function getToken(key) {
  return Cookies.get(key)
}

export function setToken(key, token) {
  return Cookies.set(key, token)
}

export function removeToken(key) {
  return Cookies.remove(key)
}
