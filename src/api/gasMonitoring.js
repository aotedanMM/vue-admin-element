import request from '@/utils/request'

export function fetchList(gasFlag, name, limit, page) {
  return request({
    url: '/gas/findRtGasInfoByStaffName',
    method: 'get',
    params: {
      gasFlag: gasFlag,
      staffName: name,
      limit: limit,
      page: page
    }
  })
}
export function fetchGasData(query) {
  return request({
    url: '/gas/findRtGasInfoByStaffName',
    method: 'get',
    params: query
  })
}
export function sendFilter() {
  return request({
    url: '/gas/updateOrgIdAndDeptId',
    method: 'get'
  })
}
export function getGasInfor(num) {
  return request({
    url: '/gas/getRecentlyGasInfo/' + num,
    method: 'get'
  })
}

