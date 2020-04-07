/**
 * Created by jiachenpan on 16/11/18.
 */

// 用户名
export function isvalidUsername(str) {
  const reg = /^[a-zA-Z0-9_-]{4,16}$/
  return reg.test(str)
}

// 名称(中文,英文,数字)
export function isvalidateName(str) {
  const reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/
  return reg.test(str)
}

// 编辑&搜索&新增人员姓名(中文)
export function isvalidateStaffName(str) {
  const reg = /^[\u4e00-\u9fa5]{2,5}$/
  return reg.test(str)
}

// 身份证号
export function isvalidateIdNumber(str) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}

// 手机号码
export function isvalidatePhoneNumber(str) {
  const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
  return reg.test(str)
}

// 零或非零开头的最多带两位小数的数字
export function isvalidateDecimal(str) {
  const reg = /^(0|[1-9][0-9]*)?(\.[0-9]{1,2})?$/
  return reg.test(str)
}

// IP
export function isvalidateIp(str) {
  const reg = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/
  return reg.test(str)
}

// 描述(中英文,数字,各种常用符号 排除特殊字符)
export function isvalidateDesc(str) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9_\,\.\，\。\ ]*$/
  return reg.test(str)
}

// 子网掩码
export function isvalidateSubnetMask(str) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/
  return reg.test(str)
}

// 版本号(软件&硬件)
export function isvalidateVersion(textVal) {
  const reg = /^\d+\.\d+\.\d+$/
  return reg.test(textVal)
}

// mac地址校验
export function isvalidateMac(textVal) {
  const pattern = /^([A-Za-z0-9]{2}-){5}[A-Za-z0-9]{2}$/
  return pattern.test(textVal)
}

// 型号版本号
export function isvalidateModelVersion(textVal) {
  const reg = /^[A-Za-z0-9]*$/
  return reg.test(textVal)
}

// 数字
export function isvalidateNum(textVal) {
  const reg = /^[0-9]*$/
  return reg.test(textVal)
}

/* 合法uri*/
export function validateURL(textVal) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textVal)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

