import request from '@/utils/request'

// 获取定位异常数据
export function fetchPositionAb(query) {
  return request({
    url: '/gas/getEMsg',
    method: 'get',
    params: query
  })
}

// 获取紧急呼叫数据
export function fetchEmCall(query) {
  return request({
    url: '/getECallList',
    method: 'get',
    params: query
  })
}

// 获取警告气体数量
export function fetchWarningGas(query) {
  return request({
    url: '/getWarningGasCount',
    method: 'get',
    params: query
  })
}
