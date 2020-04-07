import request from '@/utils/request'
// 获取聊天列表
export function fetchChatList(query) {
  return request({
    url: '/call/chatList',
    method: 'get',
    params: query
  })
}
// 更新聊天列表
export function updateChatList(data) {
  return request({
    url: '/call/addChatRecord',
    method: 'post',
    data
  })
}
// 更新语音已读状态
export function updateVoiceStatusById(seqId) {
  return request({
    url: '/call/updateChatRecordStatusBySeqId',
    method: 'put',
    params: {
      seqId: seqId
    }
  })
}
// 根据员工ID获取聊天记录
export function fetchStaffChatInfo(query) {
  return request({
    url: '/call/chatRecord',
    method: 'get',
    params: query
  })
}

// 根据员工ID获取历史聊天记录
export function fetchStaffHistoryChatInfo(query) {
  return request({
    url: '/call/chatRecordTwo',
    method: 'get',
    params: query
  })
}

// 根据员工ID删除聊天列表
export function deleteChatListByStaffId(staffId) {
  return request({
    url: '/call/deleteChatRecord?staffId=' + staffId,
    method: 'delete'
  })
}

// 根据员工ID获取气体信息
export function fetchStaffGasInfo(staffId) {
  return request({
    url: '/gas/findRecentlyGasInfoByStaffId/' + staffId,
    method: 'get'
  })
}

// 上传音频文件
export function uploadVoice(formData) {
  return request({
    url: '/staff/call',
    method: 'post',
    data: formData
  })
}

// 判断终端是否在线
export function checkStaffOnline(staffId) {
  return request({
    url: '/checkTerminalOnline',
    method: 'get',
    params: {
      staffId: staffId
    }
  })
}

// 添加实时语音通话
export function addVoiceCallRecord(query) {
  return request({
    url: '/call/newCallRecordNew',
    method: 'post',
    data: query
  })
}

export function fetchUnReadAmount(staffId) {
  return request({
    url: 'call/singleVoiceNum',
    method: 'get',
    params: {
      staffId: staffId
    }
  })
}
