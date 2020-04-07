import request from '@/utils/request'
// 显示全部部门
export function fetchDept(query) {
  return request({
    url: '/staff/dept/getDepts',
    method: 'get',
    params: query
  })
}
// 显示当前部门下所有的分组信息
export function fetchGroup(query) {
  return request({
    url: '/staff/group/getAllGroupInfo',
    method: 'get',
    params: query
  })
}

// 显示当前分组下所有的员工信息
export function fetchGroupStaff(groupId, limit, page) {
// export function fetchGroupStaff(groupId) {
  return request({
    url: '/staff/group/getAllStaffByGroupId',
    method: 'get',
    params: {
      groupId: groupId,
      limit: limit,
      page: page
    }
  })
}

// 筛选部门显示部门下所有分组
export function fetchDeptGroup(deptId, limit, page) {
  return request({
    url: '/staff/group/getGroupInfoByStaffDeptId?staffDeptId=' + deptId,
    method: 'get',
    params: {
      limit: limit,
      page: page
    }
  })
}

// 删除部门
export function Deptdelete(deptIds) {
  return request({
    url: '/staff/dept/deleteDepts?ids=' + deptIds,
    method: 'delete'
    // params: {
    //   ids: deptIds
    // }
  })
}

// 删除分组
export function Groupdelete(groupIds) {
  return request({
    url: '/staff/group/deleteGroups?ids=' + groupIds,
    method: 'delete'
    // params: {
    //   ids: deptIds
    // }
  })
}
// 查找部门
export function searchDept(deptId, deptName, limit, page) {
  return request({
    url: '/staff/dept/getDeptsByParams',
    method: 'get',
    params: {
      deptId: deptId,
      deptName: deptName,
      limit: limit,
      page: page
    }
  })
}
// 新建组
export function createGroup(deptId, groupName) {
  return request({
    url: '/staff/group/addGroup',
    method: 'post',
    data: {
      deptId: deptId,
      groupName: groupName
    }
  })
}
// 新建部门
export function createDept(data) {
  return request({
    url: '/staff/dept/addDept',
    method: 'post',
    data
  })
}

// 编辑部门
export function updateDept(data) {
  return request({
    url: '/staff/dept/updateDept',
    method: 'put',
    data
  })
}
// 编辑组
export function updateGroup(data) {
  return request({
    url: '/staff/group/updateGroup',
    method: 'put',
    data
  })
}

// 绑定打卡部门ID， 给部门下的所有员工绑定打卡基站
export function bindingAttendanceStationOfDept(data) {
  return request({
    url: '/staff/bindingAttendanceBaseStation/' + data.stationId,
    method: 'put',
    params: data
  })
}

// 根据分组的ID，给分组下所有的员工绑定打卡基站
export function bindingAttendanceStationOfGroup(data) {
  return request({
    url: '/staff/bindingAttendanceBaseStation',
    method: 'put',
    data
  })
}

// 根据员工的ID，可以数组形式传入多个ID 绑定打卡基站
export function bindingAttendanceStationOfStaffIds(data) {
  return request({
    url: '/staff/bindingAttendanceBaseStation/' + data.stationId + '?staffIds=' + data.staffIds,
    method: 'put'
  })
}

