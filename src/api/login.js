import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      account: username,
      passWord: password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function checkPasswordData(username, password) {
  return request({
    url: '/permissionCheck',
    method: 'get',
    params: {
      account: username,
      password: password
    }
  })
}
