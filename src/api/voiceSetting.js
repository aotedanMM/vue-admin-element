import request from '@/utils/request'

// 根据ID设置当前铃声被选中并把更改其他铃声的状态
export function updateVoiceSetting(id) {
  return request({
    url: '/rangSetting/updateStatusById' + id,
    method: 'put'
  })
}

// 根据声音类型获取全部声音
export function fetchVoiceDataByType() {
  return request({
    url: '/rangSetting/findRangByType',
    method: 'get'
  })
}

// 获取警报等级气体相关的声音
export function fetchVoiceDataByGasLevel(levelId) {
  return request({
    url: '/rangSetting/findRangByLevelDataId?levelId=' + levelId,
    method: 'get'
  })
}

// 恢复默认设置
export function resetDefaultSetting() {
  return request({
    url: '/rangSetting/restoreDefaultRang',
    method: 'put'

  })
}
// 保存设置--单条，普通呼叫，紧急呼叫
export function saveVoiceSetting(ids) {
  return request({
    url: '/rangSetting/updateStatusById?ids=' + ids,
    method: 'put'
  })
}

// 保存设置--气体警告等级
export function saveGasLevelSetting(jsonStr) {
  return request({
    url: '/rangSetting/updateRangIdByLevelId?jsonStr=' + encodeURIComponent(jsonStr, 'utf-8'),
    method: 'put',
    data: jsonStr
  })
}

// 新增声音
export function createVoiceData(rangSetting) {
  return request({
    url: '/rangSetting/addRang',
    method: 'post',
    data: rangSetting
  })
}

// 更新声音
export function updateVoiceData(rangSetting) {
  return request({
    url: '/rangSetting/updateRang' + rangSetting,
    method: 'put'
  })
}

// 删除声音
export function deleteVoiceData(id) {
  return request({
    url: '/rangSetting/deleteRang?id=' + id,
    method: 'delete'
  })
}
