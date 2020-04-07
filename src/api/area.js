import request from '@/utils/request'
// 根据分页参数查询，获取所有的空间信息
export function fetchArea(searchParams) {
  return request({
    url: '/area/getAreasInfo',
    method: 'get',
    params: searchParams
  })
}
export function createArea(areaForm) {
  return request({
    url: '/area/addArea',
    method: 'post',
    data: areaForm
  })
}
export function updateArea(areaForm) {
  return request({
    url: '/area/updateArea',
    method: 'put',
    data: areaForm
  })
}
// 删除分站信息，可以单独删除，也可批量操作
// TODO未添加存在校验
export function deleteArea(ids) {
  return request({
    url: '/area/deleteArea?ids=' + ids,
    method: 'delete'
  })
}
// 根据分站ID查询分站下的基站
export function fetchAreaStation(areaStationQuery) {
  return request({
    url: '/station/findStationByAreaId',
    method: 'get',
    params: areaStationQuery
  })
}

// 发送指令
export function sendCommand(query) {
  return request({
    url: '/drools/test',
    method: 'get',
    params: {
      command: query
    }
  })
}

