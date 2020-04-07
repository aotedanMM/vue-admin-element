import request from '@/utils/request'
// -------------标准信息管理-----------------//
// 获取所有标准信息
export function fetchStandardInfo() {
  return request({
    url: '/getGasStandardInfo',
    method: 'get'
  })
}
// 根据ID删除标准信息
export function deleteStandardInfoById(standardId) {
  return request({
    url: '/deleteGasStandardInfo/' + standardId,
    method: 'delete'
  })
}

// 新增标准信息
export function createStandardData(standard) {
  return request({
    url: '/addGasStandardInfo',
    method: 'post',
    data: standard
  })
}
// 更新标准信息
export function updateStandardData(standardForm) {
  return request({
    url: '/updateGasStandardInfo',
    method: 'put',
    data: standardForm
  })
}
// -------------警告气体等级管理-----------------//

// 根据标准id获取当前标准下的警报气体数据

// 获取所有的气体警告等级信息
export function fetchWarnGasLevelInfo(standardId) {
  return request({
    url: '/getWarnSettingByStandardId/' + standardId,
    method: 'get'
  })
}
// 根据ID删除气体警告等级信息
export function deleteWarnGasLevelInfoById(gasLevelId) {
  return request({
    url: '/deleteWarnSetting/' + gasLevelId,
    method: 'delete'
  })
}
// 更新气体警告等级信息
export function updateWarnGasLevelData(gasLevelForm) {
  return request({
    url: '/updateWarnSetting',
    method: 'put',
    data: gasLevelForm
  })
}
// 新增气体警告等级信息
export function createWarnGasLevelData(gasWarnSetting) {
  return request({
    url: '/addWarnSetting',
    method: 'post',
    data: gasWarnSetting
  })
}

// -------------警报等级管理-----------------//
// 获取所有警报等级信息
export function fetchWarnLevel() {
  return request({
    url: '/levelData/getDataByParams',
    method: 'get'
  })
}

// 新增警报等级
export function createWarnLevel(levelData) {
  return request({
    url: '/levelData/add',
    method: 'post',
    data: levelData
  })
}

// 更新警报等级
export function updateWarnLevel(levelData) {
  return request({
    url: '/levelData/update',
    method: 'put',
    data: levelData
  })
}

// 删除警报等级
export function deleteWarnLevel(id) {
  return request({
    url: '/levelData/delete/' + id,
    method: 'delete'
  })
}
