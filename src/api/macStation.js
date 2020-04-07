import request from '@/utils/request'

// 获终端详情
export function findPersonDetailInfo(probeQuery) {
  return request({
    url: '/mac/getPersonByStationId/' + probeQuery.stationId,
    method: 'get',
    params: probeQuery
  })
}
