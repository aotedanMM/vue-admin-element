import request from '@/utils/request'

// 查询基站周围的终端数量
export function getMacNum() {
  return request({
    url: '/mac/getMacNum',
    method: 'get'
  })
}

// 显示全部基站信息
export function fetchStation() {
  return request({
    url: '/station/findStationInfoByParams',
    method: 'get'
  })
}
// 根据员工ID获取员工位置信息
export function fetchStaffPosition(staffId) {
  return request({
    url: '/terminalRoad/findNowSiteByStaffId',
    method: 'get',
    params: {
      staffId: staffId
    }
  })
}

// 按照基站ID查询基站信息
export function findStationById(baseStationId) {
  return request({
    url: '/station/findStationById',
    method: 'get',
    params: {
      stationId: baseStationId
    }
  })
}// 按照基站ID查询基站信息
export function findStationByNum(baseStationId) {
  return request({
    url: '/station/findStationByNum',
    method: 'get',
    params: {
      stationId: baseStationId
    }
  })
}
// 删除基站信息
export function deleteStation(baseStationId) {
  return request({
    url: '/station/delete/' + baseStationId,
    method: 'delete'
  })
}
// 新增基站信息
export function createStation(stationForm) {
  return request({
    url: '/station/add',
    method: 'post',
    data: stationForm
  })
}
// 获取所有已使用的基站
export function fetchUsedStation(query) {
  return request({
    url: '/station/findInUsedStation',
    method: 'get',
    params: query
  })
}
// 按时间查询基站信息
export function searchStation(startTime, endTime) {
  return request({
    url: '/station/find/' + startTime + ',' + endTime,
    method: 'get',
    params: {
      begin: startTime,
      end: endTime
    }
  })
}
// 多条件查询基站信息
export function searchStationByQuery(baseStationQuery) {
  return request({
    url: '/station/findStationInfoByParams',
    method: 'get',
    params: baseStationQuery
  })
}
// 编辑基站信息
export function updateStation(data) {
  return request({
    url: '/station/update',
    method: 'put',
    data
  })
}

// 在地图上绑定基站信息
export function bindStation(baseStationId, x, y, z) {
  return request({
    url: '/station/bindingMap',
    method: 'put',
    params: {
      baseStationId: baseStationId,
      x: x,
      y: y,
      z: z
    }
  })
}

// 在地图上绑定基站信息
export function removeStation(baseStationId) {
  return request({
    url: '/station/removeBaseStationFromMap',
    method: 'put',
    params: {
      baseStationId: baseStationId
    }
  })
}

// 批量删除基站信息
export function deleteStations(baseStationIds) {
  return request({
    url: '/station/delete?ids=' + baseStationIds,
    method: 'delete'
  })
}

export function checkStationNumExist(baseStationNum) {
  return request({
    url: '/station/checkStationNumExist',
    method: 'get',
    params: {
      stationNum: baseStationNum
    }
  })
}
export function getAllBaseStationNameAndId() {
  return request({
    url: '/station/getAllBaseStationNameAndId',
    method: 'get'
  })
}
export function updateStationTypeByStationNum(id, type) {
  return request({
    url: '/station/updateStationTypeByStationNum',
    method: 'put',
    params: {
      stationNum: id,
      type: type
    }
  })
}
export function modifyFrequency(data) {
  return request({
    url: '/station/settingFrequency',
    method: 'put',
    params: data
  })
}
// 分页查询掉线基站的信息 queryParams 查询的分页参数
export function getOfflineStation(queryParams) {
  return request({
    url: '/station/getOfflineStation',
    method: 'get',
    params: queryParams
  })
}
export function getOfflineStationCount() {
  return request({
    url: '/station/getOfflineStationCount',
    method: 'get'
  })
}
export function removeOfflineStations(formParams) {
  return request({
    url: '/station/removeOfflineStation',
    method: 'delete',
    params: formParams
  })
}
