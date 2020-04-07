import request from '@/utils/request'

// 获取气体等级
export function getLevelData() {
  return request({
    url: '/levelData/getDataByParams',
    method: 'get'
  })
}
// 获取标准
export function getGasLevelStandard() {
  return request({
    url: '/getGasStandardInfo',
    method: 'get'
  })
}
// 绑定标准
export function bindingStandard(form) {
  return request({
    url: '/station/baseStationBindingStandard',
    method: 'post',
    params: {
      standardId: form.standardId,
      baseStationIds: form.baseStationIds
    }
  })
}

