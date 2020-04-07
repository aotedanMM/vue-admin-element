import request from '@/utils/request'

export function fetchWorkAbnormal(query) {
  return request({
    url: 'staffAssign/getStaffAssignException',
    method: 'get',
    params: query
  })
}

export function fetchWorkAbnormalNum() {
  return request({
    url: 'staffAssign/getStaffAssignExceptionSum',
    method: 'get'
  })
}
