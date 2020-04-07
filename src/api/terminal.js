import request from '@/utils/request'
// 获取电池电量
export function getBattery(terminalNum) {
  return request({
    url: '/terminal/getBattery',
    method: 'get',
    params: {
      terminalNum: terminalNum
    }
  })
}
// 发送获取电池电量指令
export function sendGetBatteryCmd(terminalNum) {
  return request({
    url: '/terminal/sendGetBatteryCmd',
    method: 'get',
    params: {
      terminalNum: terminalNum
    }
  })
}
// 检查终端是否在线(终端ID)
export function checkStaffOnlineByTerminal(terminalNum) {
  return request({
    url: '/checkTerminalOnlineByTerminalNum',
    method: 'get',
    params: {
      terminalNum: terminalNum
    }
  })
}

// 获取全部终端信息
export function fetchTerminal(query) {
  return request({
    url: '/terminal/getTerminalByParams',
    method: 'get',
    params: query
  })
}

// 新建终端
export function createDateTerminal(terminalForm) {
  return request({
    url: '/terminal/addTerminal',
    method: 'post',
    data: terminalForm
  })
}
// 编辑终端信息
export function updateDateTerminal(data) {
  return request({
    url: '/terminal/update',
    method: 'put',
    data
  })
}
// 批量导入人员信息
export function uploadStaff(tableData) {
  return request({
    url: '/staff/addStaffs',
    method: 'post',
    data: tableData
  })
}

// 删除终端
export function deleteTerminals(terminalIds) {
  return request({
    url: '/terminal/delete/' + terminalIds,
    method: 'delete'
  })
}

// 批量删除终端
export function selectDeleteTerminals(arr) {
  return request({
    url: '/terminal/delete?ids=' + arr,
    method: 'delete'
  })
}

// 检查终端ID是否存在
export function checkExist(terminalId) {
  return request({
    url: '/terminal/checkExist?terminalId=' + terminalId,
    method: 'get'
  })
}

export function uploadTerminals(data) {
  return request({
    url: '/terminal/addTerminals',
    method: 'POST',
    data: data
  })
}
