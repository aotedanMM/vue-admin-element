import request from '@/utils/request'

export function sendTest() {
  return request({
    url: 'aq/test/sendControl',
    method: 'get'
  })
}
