import request from '@/utils/request'

// 获取井下总人数-部门信息
export function fetchTotalData() {
  return request({
    url: '/attendance/getAttendanceDept',
    methods: 'get'
  })
}

// 获取超时未上井人数-部门信息
export function fetchTimeOutData() {
  return request({
    url: '/attendance/getOverTimeDept',
    methods: 'get'
  })
}

// 获取严重超时人数-部门信息
export function fetchSevereTimeOutData() {
  return request({
    url: '/attendance/getSeriousTimeDept',
    methods: 'get'
  })
}

// 获取缺勤人数-部门信息
export function fetchAbsenceData() {
  return request({
    url: '/attendance/getRtUnAttendanceDept',
    methods: 'get'
  })
}

// 获取总人数-员工信息
export function fetchDownHoleStaffData(query) {
  return request({
    url: '/attendance/getRtAttendanceStaff',
    methods: 'get',
    params: query
  })
}

// 获取超时未上井-员工信息
export function fetchTimeOutStaffData(query) {
  return request({
    url: '/attendance/getOverTimeStaff',
    methods: 'get',
    params: query
  })
}

// 获取严重超时-员工信息
export function fetchSevereTimeOutStaffData(query) {
  return request({
    url: '/attendance/getSeriousTimeStaff',
    methods: 'get',
    params: query
  })
}

// 获取缺勤人数-员工信息
export function fetchAbsenceStaffData(query) {
  return request({
    url: '/attendance/getUnAttendanceStaff',
    methods: 'get',
    params: query
  })
}

// 获取员工轨迹
export function fectchDownHoleStaffTrack(query) {
  return request({
    url: '/terminalRoad/findTerminalRoadByInOreTime',
    methods: 'get',
    params: query
  })
}

