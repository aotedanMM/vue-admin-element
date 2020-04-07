import request from '@/utils/request'

// get
export function getTimeStandard(paramsForm) {
  return request({
    url: '/timeStandard/getInfo',
    method: 'get',
    params: paramsForm
  })
}

// update
export function updateTimeStandard(dataForm) {
  return request({
    url: '/timeStandard/updateTimeStandard',
    method: 'put',
    data: dataForm
  })
}

// delete
export function deleteTimeStandard(ids) {
  return request({
    url: '/timeStandard/deleteTimeStandard?ids=' + ids,
    method: 'delete'
  })
}

// insert
export function insertTimeStandard(dataForm) {
  return request({
    url: '/timeStandard/addTimeStandard',
    method: 'post',
    data: dataForm
  })
}

