import request from '@/utils/request'

export function fetchOperateData(query) {
  return request({
    url: 'operationLog/getOperationLog',
    method: 'get',
    params: query
  })
}

export function addOperate(query) {
  return request({
    url: 'operationLog/addOperationLog',
    method: 'post',
    data: query
  })
}
