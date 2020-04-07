import request from '@/utils/request'

// 添加
export function addStaffJob(data) {
  return request({
    url: '/staff/addStaffJob',
    method: 'POST',
    data: data
  })
}
// 修改
export function modifyStaffJob(data) {
  return request({
    url: '/staff/updateStaffJob',
    method: 'put',
    data: data
  })
}
// 删除
export function delStaffJob(data) {
  return request({
    url: '/staff/delStaffJob/' + data,
    method: 'delete'
  })
}
// 获取信息
export function getStaffJobByParams(param) {
  return request({
    url: '/staff/getStaffJobsByParams',
    method: 'get',
    params: param
  })
}
