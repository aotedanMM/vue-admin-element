import request from '@/utils/request'
// 获取规则数据
export function fetchRuleData(query) {
  return request({
    url: '/fetchRule',
    methods: 'get',
    params: query
  })
}

// 新增规则
export function addRuleData(form) {
  return request({
    url: '/addRule',
    method: 'post',
    data: form
  })
}
// 编辑规则
export function editRuleData(form) {
  return request({
    url: '/editRule',
    method: 'post',
    data: form
  })
}
// 删除规则

export function deleteRuleData(id) {
  return request({
    url: '/deleteRule',
    method: 'delete',
    params: id
  })
}
