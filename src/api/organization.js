import request from '@/utils/request'

// 获取所有的部门信息
export function getOrgInfo() {
  return request({
    url: '/staff/findStaffOrganization',
    method: 'get'
  })
}
// 根据ID删除部门信息
export function delOrgInfoById(orgData) {
  return request({
    url: '/staff/deleteStaffOrganization',
    method: 'delete',
    params: orgData
  })
}
// 更新部门信息
export function updateOrgInfo(orgData) {
  return request({
    url: '/staff/updateStaffOrganization',
    method: 'put',
    data: orgData
  })
}
// 插入org信息
export function insertOrgInfo(orgData) {
  return request({
    url: '/staff/addStaffOrganization',
    method: 'post',
    data: orgData
  })
}
