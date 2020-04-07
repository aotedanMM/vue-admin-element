import request from '@/utils/request'

export function getLackElectricInfo(queryParams) { // 多条件分页查询所有的欠电终端
  return request({
    url: '/lackElectric/findLackElectric',
    method: 'get',
    params: queryParams
  })
}
export function updateLackElectricInfo() { // 更新电量为已读状态
  return request({
    url: '/lackElectric/updateIsRead',
    method: 'put'
  })
}
export function getLackElectricCount() { // 获取所有的终端欠电的未读数量
  return request({
    url: '/lackElectric/findIsReadCount',
    method: 'get'
  })
}
