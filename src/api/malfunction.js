import request from '@/utils/request'

// 列表显示终端故障
export function fetchMalfunction(query) {
  return request({
    url: '/malfunction/findMalfunctionInfo',
    method: 'get',
    params: query
  })
}

// 根据终端编号查找终端故障
export function fetchListByTerminalId(query) {
  return request({
    url: '/malfunction/findMalfunctionInfo',
    method: 'get',
    params: query
  })
}

// 点击处理，更新终端故障的状态
export function updateStatus(selfCheckId) {
// export function fetchGroupStaff(groupId) {
  return request({
    url: '/malfunction/updateStatusById',
    method: 'post',
    params: {
      selfCheckId: selfCheckId
    }
  })
}

// 点击删除故障信息
export function deleteMalfunctions(ids) {
  return request({
    url: '/malfunction/deleteMalfunctions?ids=' + ids,
    method: 'delete'
  })
}
export function getMalfunctionCount() {
  return request({
    url: '/malfunction/getMalfunctionCount',
    method: 'get'
  })
}
// 获取所有的故障异常信息
export function fetchMalfunctionByStatusIsRead(query) {
  return request({
    url: '/malfunction/findMalfunctionInfoIsRead',
    method: 'get',
    params: query
  })
}
