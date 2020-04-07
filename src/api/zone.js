import request from '@/utils/request'

// 根据分页参数查询，获取所有的空间信息
export function fetchZone(searchParams) {
  return request({
    url: '/zone/getZonesInfo',
    method: 'get',
    params: searchParams
  })
}
// 新增区域
export function createZone(zoneForm) {
  return request({
    url: '/zone/addZone',
    method: 'post',
    data: zoneForm
  })
}
// 根据ID数组，删除所有的空间信息
export function deleteZoneByIds(ids) {
  return request({
    url: '/zone/deleteZone?ids=' + ids,
    method: 'delete'
  })
}
// 更新大区信息
export function updateZone(zoneForm) {
  return request({
    url: '/zone/updateZone',
    method: 'put',
    data: zoneForm
  })
}
