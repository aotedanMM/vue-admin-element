import request from '@/utils/request'

// 新增指派
export function addAssignData(query) {
  return request({
    url: 'staffAssign/addStaffAssign',
    method: 'post',
    data: query
  })
}

// 删除指派
export function deleteAssignData(id) {
  return request({
    url: 'staffAssign/deleteStaffAssign/' + id,
    method: 'delete'
  })
}

// 编辑指派
export function editAssignData(query) {
  return request({
    url: 'staffAssign/updateStaffAssign',
    method: 'put',
    data: query
  })
}

// 获取&查询指派
export function fetchAssignData(query) {
  return request({
    url: 'staffAssign/getStaffAssignInfo',
    method: 'get',
    params: query
  })
}
