import request from '@/utils/request'
// 获取区域
export function fetchWarningAreaData(query) {
  return request({
    url: '/warningArea/findAreaInfoByType',
    method: 'get',
    params: query
  })
}

// 根据区域类型，查看该区域现在的总人数
export function fetchStaffNumByType(type) {
  return request({
    url: '/warningArea/findStaffNumByType?type=' + type,
    method: 'get'
  })
}

export function fetchWarningAreaHistory(query) {
  return request({
    url: '/warningArea/findHistoryAreaRecord',
    method: 'get',
    params: query
  })
}
// 新增区域
export function createWarningAreaData(areaForm) {
  return request({
    url: '/warningArea/addAreaInfo',
    method: 'post',
    data: areaForm
  })
}
// 编辑区域
export function updateWarningAreaData(query) {
  return request({
    url: '/warningArea/updateAreaInfo',
    method: 'put',
    data: query
  })
}
// 删除区域
export function deleteWarningAreaData(areaId) {
  return request({
    url: '/warningArea/deleteAreaInfo/' + areaId,
    method: 'delete'
  })
}

// 删除区域点坐标
export function deleteCoordinate(areaId) {
  return request({
    url: '/warningArea/deleteCoordinate/' + areaId,
    method: 'delete'
  })
}

// 根据区域ID获取限制区域正在该区域的人员信息
export function fetchWarningAreaStaffNum(query) {
  return request({
    url: '/warningArea/findAreaRecordByAreaId',
    method: 'get',
    params: query
  })
}

// 根据员工ID获取员工出入警告区域历史
export function fetchAccessStaffHistory(query) {
  return request({
    url: '/warningArea/findAreaRecordByStaffId',
    method: 'get',
    params: query
  })
}

// 根据区域ID,查找该区域的历史人员信息
export function fetchAccessHistoryByAreaId(query) {
  return request({
    url: '/warningArea/findHistoryAreaRecord',
    method: 'get',
    params: query
  })
}
// 获取超员报警人数
export function fetchOverCrowData(query) {
  return request({
    url: 'overman/getOvermanAreaInfo',
    method: 'get',
    params: query
  })
}

// 获取领导干部人数
export function fetchLeaderData(query) {
  return request({
    url: '/attendance/getAttendance',
    method: 'get',
    params: query
  })
}

// 超员员工信息
export function fetchOverAreaStaff(query) {
  return request({
    url: 'overman/getOvermanStaffInfo',
    method: 'get',
    params: query
  })
}
