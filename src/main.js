import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import vueSeamlessScroll from 'vue-seamless-scroll'
import VueScroller from 'vue-scroller'
import '@/icons' // icon
import '@/permission' // permission control 重定向
import echarts from 'echarts'
import VueContextMenu from '@xunlei/vue-context-menu'
import Print from 'vue-print-nb'
import common from '@/commonFunction/common.js' // 引入公共方法
import requestFun from '@/commonFunction/requestFun.js'
import AreaSelect from '@/components/AreaSelect'
import '@/commonFunction/otherRender.js'
// 引用全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.requestFun = requestFun
Vue.prototype.common = common // 使用公共方法
Vue.use(echarts)
Vue.use(Print) // 注册
Vue.use(ElementUI, { zhLocale })
Vue.use(AreaSelect) // 引用自定义组件
Vue.use(vueSeamlessScroll)
Vue.use(VueScroller)
Vue.use(VueContextMenu)
Vue.component('area-select', AreaSelect) // 初始化组件
Vue.config.productionTip = false
new Vue({
  el: '#app',
  components: {
    vueSeamlessScroll,
    AreaSelect
  },
  router,
  store,
  render: h => h(App)
})

