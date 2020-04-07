/* eslint-disable */
export default{
   debounce(fn, delay) {
  let timer; // 维护一个 timer
  return function () {
    let _this = this; // 取debounce执行作用域的this
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      fn.apply(_this, args); // 用apply指向调用debounce的对象，相当于_this.fn(args);
    }, delay);
  };
},
  // 打开弹窗，body不滚动
  toggleBody(isPin) {
    if (isPin) {
      document.body.style.height = '100vh'
      document.body.style['overflow-y'] = 'hidden'
    } else {
      document.body.style.height = 'unset'
      document.body.style['overflow-y'] = 'auto'
    }
  },
  // 导出人员信息 格式化性别
  handleStaffSex(staffSex) {
    if (staffSex === 0) {
      return '男'
    } else {
      return '女'
    }
  },
  // 时间戳转日期格式(Y-M-D) 年月日
  formatDateDay(value) {
    const date = new Date(value)
    const y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? ('0' + MM) : MM
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '-' + MM + '-' + d
  },
  // 时间戳转日期格式(Y-M-D) 年月日 时分秒
  // yyyy-MM-dd HH:mm:ss
  formatDate(value) {
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
  },
  // 导出人员信息 格式化人员类型
  handlePersonType(personType) {
    switch (personType) {
      case 0 :
        return '职工'
      case 1:
        return '领导'
      case 2:
        return '外来人员'
      case 3:
        return '车辆'
    }
  },
  
  // 判断批量上传数组中的每一条,是否所有字段全部填写
  handleUploadJudge(tableHeader, tableData) {
     console.log(tableHeader)
     console.log(tableData)
    for (const m of tableData) {
      let counter = 0
      for (const key in m) {
        counter++
      }
      if (counter < tableHeader.length) {
        return false
      }
    }
    return true
  }
}
/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t) => {
  let delay = t || 500
  let timer
  return function () {
    let args = arguments
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
};
/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fn, t) => {
  let last
  let timer
  let interval = t || 500
  return function () {
    let args = arguments
    let now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        fn.apply(this, args)
      }, interval)
    } else {
      last = now
      fn.apply(this, args)
    }
  }
}
