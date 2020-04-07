import request from '@/utils/request'

// 获取所有的部门信息
export function getPartitionInfo(query) {
  return request({
    url: '/partition/findPartition',
    method: 'get'
  })
}
// 根据ID删除部门信息
export function delPartitionInfoById(partitionData) {
  return request({
    url: '/partition/deletePartition',
    method: 'delete',
    params: partitionData
  })
}
// 更新部门信息
export function updatePartitionInfo(partitionData) {
  return request({
    url: '/partition/updatePartition',
    method: 'put',
    data: partitionData
  })
}
// 插入org信息
export function insertPartitionInfo(partitionData) {
  return request({
    url: '/partition/addPartition',
    method: 'post',
    data: partitionData
  })
}
