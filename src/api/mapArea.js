import request from '@/utils/request'

// 电子围栏点集合操作
export function insertAreaData(areaId, data) {
  return request({
    url: '/warningArea/updateCoordinateList?areaId=' + areaId,
    method: 'POST',
    data
  })
}

export function getAreaDataByWarningAreaId(id) {
  return request({
    url: '/warningArea/getAllAreaInfo',
    method: 'GET',
    params: {
      areaId: id
    }
  })
}
export function getAllWarningAreaData() {
  return request({
    url: '/warningArea/getAllWarningArea',
    method: 'GET'
  })
}
export function inWarningArea(data) {
  return request({
    url: '/warningArea/addAreaRecord',
    method: 'POST',
    data
  })
}
export function outWarningArea(staffId) {
  return request({
    url: '/warningArea/updateOutTime',
    method: 'PUT',
    params: {
      staffId: staffId
    }
  })
}

// 根据区域ID获取区域内人员数量
export function fetchAreaStaffNum(partitionId) {
  return request({
    url: 'attendance/getStaffNumByPartition',
    method: 'get',
    params: {
      partitionId: partitionId
    }
  })
}
// 获取区域内员工信息
export function fetchAreaStaffData(query) {
  return request({
    url: 'attendance/getStaffInfoByPartition',
    method: 'get',
    params: query
  })
}
