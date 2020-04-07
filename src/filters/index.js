// set function parseTime,formatTime to filter
/* eslint-disable */
export { parseTime, formatTime } from '@/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
// 时间戳转日期格式(Y-M-D H:M:S) 精确到秒
export function formatDate(value) {
  const date = new Date(value)
  const y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  let s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
}
export function formateWeek(value) {
  switch (value) {
    case 1:
      return '星期一'
    case 2:
      return '星期二'
    case 3:
      return '星期三'
    case 4:
      return '星期四'
    case 5:
      return '星期五'
    case 6:
      return '星期六'
    case 0:
      return '星期日'
  }
}

// 时间戳转日期格式(Y-M-D) 年月日
export function formatDateDay(value) {
  const date = new Date(value)
  const y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + MM + '-' + d
}

// 时间戳转日期格式(H:M:S) 时分秒
export function formatDateSecond(value) {
  const date = new Date(value)
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  let s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  return h + ':' + m + ':' + s
}
// 时间戳转日期格式(H:M) 时分
export function formatDateMinute(value) {
  const date = new Date(value)
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  return h + ':' + m
}

// 计算时间差,不超过一天显示时分，超过一天显示年月日
export function timeAgo(time) {
  const timestamp = new Date().getTime()
  const date = new Date(time)
  const timeDifference = parseInt((timestamp - time) / 1000 / 60) // 时间差
  if (timeDifference < 60 * 24) {
    let H = date.getHours() // 时
    H = H < 10 ? ('0' + H) : H
    let MM = date.getMinutes() // 分
    MM = MM < 10 ? ('0' + MM) : MM
    return H + ':' + MM
  } else {
    const Y = date.getFullYear() // 年
    let M = date.getMonth() + 1 // 月
    M = M < 10 ? ('0' + M) : M
    let D = date.getDate() // 日
    D = D < 10 ? ('0' + D) : D
    return Y + '-' + M + '-' + D
  }
}

// export function timeAgo(time) {
//   const between = Date.now() / 1000 - Number(time)
//   if (between < 3600) {
//     return pluralize(~~(between / 60), ' minute')
//   } else if (between < 86400) {
//     return pluralize(~~(between / 3600), ' hour')
//   } else {
//     return pluralize(~~(between / 86400), ' day')
//   }
// }

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
