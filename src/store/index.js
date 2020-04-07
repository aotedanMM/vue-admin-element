import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import voice from './modules/voice'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    voice
  },
  getters,
  // 定义状态
  state: {
    batteryAlarmValue: null,
    malfunctionValue: null,
    gasWarnInfo: null,
    terminalLackElectric: null,
    stationLackElectric: null,
    terminalSelfCheckResult: null,
    stationSelfCheckResult: null,
    offLineStationValue: null
  }
})
export default store
