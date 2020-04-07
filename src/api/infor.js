import request from '@/utils/request'

export function bindingTimeStandard(staffIds, standardId) {
  return request({
    url: '/staff/bindingStandard?staffIds=' + staffIds + '&standardId=' + standardId,
    method: 'post'
  })
}
// 获取全部员工信息
export function fetchStaff(query) {
  return request({
    url: '/staff/getStaffByPage',
    method: 'get',
    params: query
  })
}

// 获取员工通讯录
export function fetchPhoneBook(query) {
  return request({
    url: '/staff/getContacts',
    method: 'get',
    params: query
  })
}

// 获取员工工作内容
export function getStaffJobs(query) {
  return request({
    url: '/staff/getAllStaffJobs',
    method: 'get',
    params: query
  })
}

// 新建人员
export function createStaff(staffForm) {
  return request({
    url: '/staff/addStaff',
    method: 'post',
    data: staffForm
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

// 获取所有未绑定终端
export function fetchTerminal(query) {
  return request({
    url: '/terminal/getNotBinDingTerminals',
    method: 'get',
    params: query
  })
}

// 编辑人员信息
export function updateStaff(data) {
  return request({
    url: '/staff/updateStaff',
    method: 'put',
    data
  })
}
// 绑定终端
export function bindTerminal(staffId, staffTerminalId) {
  return request({
    url: '/terminal/binding/' + staffId,
    method: 'put',
    params: {
      staffTerminalId: staffTerminalId
    }
  })
}
// 解绑终端
export function unBindTerminal(staffTerminalId) {
  return request({
    url: 'staff/terminal/unBind/' + staffTerminalId,
    method: 'put',
    data: {
      staffTerminalId: staffTerminalId
    }
  })
}

// 删除人员
export function deleteStaff(staffIds) {
  return request({
    url: '/staff/delStaff?ids=' + staffIds,
    method: 'delete'
    // params: {
    //   ids: deptIds
    // }
  })
}
