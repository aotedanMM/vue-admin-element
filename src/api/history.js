import request from '@/utils/request'

// 显示历史轨迹 时间列表
export function fetchHistoryTimeList(data) {
  return request({
    url: '/terminalRoad/findTimeList',
    method: 'get',
    params: data
  })
}

// 按照员工ID和时间获取历史轨迹
export function fetchHistoryListData(query) {
  return request({
    url: '/terminalRoad/findTerminalRoadByTime',
    method: 'get',
    params: query
  })
}
