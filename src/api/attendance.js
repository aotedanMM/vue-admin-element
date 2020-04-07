import request from '@/utils/request'

// 获取考勤信息
export function findAllByParams(query) {
  return request({
    url: '/attendance/getInfoByParams',
    method: 'get',
    params: query
  })
}
