import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 900000, // 请求超时时间
  params: {} // 参数
})

// request请求拦截器
service.interceptors.request.use(
  config => {
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] = localStorage.getItem('token') // 携带token请求头
    }
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)
// response响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 111) {
      return response
    }
    if (res.code === 116) {
      return response
    }
    if (res.code === 500) {
      console.log('5000000000000000')
      console.log('error')
      return Promise.reject('error')
    }
    if (res.code !== 200) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      if (res.code === -102 || res.code === -101) {
        Message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
        store.dispatch('reLogin')
      }
      return Promise.reject(res.msg || 'error')
    } else {
      return response
    }
  },
  error => {
    // 报错后统一返回'error'
    console.log(error)
    return Promise.reject('error')
  }
)
export default service
