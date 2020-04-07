import { login, logout } from '@/api/login'
const user = {
  state: {
    noticeSwitch: true, // 警报提醒开关
    stopOtherPlayStatus: true, // 语音通话过程中其他警告气体推送不响铃
    incomingCall: false, // 右下角来电提醒
    emergencyCaller: false, // 紧急呼叫来电提醒
    voiceDialogVisible: false, // 语音对话框可见性
    positionAbValue: null, // 定位异常数量
    emCallValue: null, // 紧急呼叫数量
    warnGasValue: null, // 警告气体数量
    onlineStaffId: null, // 上线下线终端Id
    onlineStatus: false, // 上线下线
    globalNotifyNum: 0 // 右侧信息提示数量
  },
  mutations: {
    // 警报提醒开关
    changeNoticeSwitch(state, val) {
      state.noticeSwitch = val
    },
    // 数量+1
    addNotifyNum(state) {
      state.globalNotifyNum++
    },
    // 数量-1
    cutNotifyNum(state) {
      state.globalNotifyNum--
    },
    // 改变数量
    changeNotifyNum(state, num) {
      state.globalNotifyNum = num
    },
    // 上线下线终端Id
    onlineStaffId(state, staffId) {
      state.onlineStaffId = staffId
    },
    // 终端上线
    terminalOnline(state) {
      state.onlineStatus = true
    },
    // 终端下线
    terminalOffline(state) {
      state.onlineStatus = false
    },
    // 语音通话中,暂停其他响铃
    stopOtherPlay(state) {
      state.stopOtherPlayStatus = false
    },
    // 非语音通话中，播放其他响铃
    notStopOtherPlay(state) {
      state.stopOtherPlayStatus = true
    },
    // 定位异常数量置0
    setPositionAbValueTo0(state) {
      state.positionAbValue = 0
    },
    // 改变定位异常数量
    setPositionAbValue(state, num) {
      state.positionAbValue = num
    },
    // 紧急呼叫数量置为0
    setEmCallValueTo0(state) {
      state.emCallValue = 0
    },
    // 改变紧急呼叫数量
    setEmCallValue(state, num) {
      state.emCallValue = num
    },
    // 警告气体数量置0
    setWarnGasValueTo0(state) {
      state.warnGasValue = 0
    },
    // 改变警告气体数量
    setWarnGasValue(state, num) {
      state.warnGasValue = num
    },
    // 紧急呼叫来电提醒显示
    SHOW_EMERGENCY_CALLer(state) {
      state.emergencyCaller = true
    },
    // 紧急呼叫来电提醒隐藏
    HIDE_EMERGENCY_CALLer(state) {
      state.emergencyCaller = false
    },
    // 来电显示
    SHOW_INCOMING_CALL(state) {
      state.incomingCall = true
    },
    // 隐藏来电显示
    HIDE_INCOMING_CALL(state) {
      state.incomingCall = false
    },
    // 显示语音对话框
    SHOW_VOICE_DIALOG(state) {
      state.voiceDialogVisible = true
    },
    // 隐藏语音对话框
    HIDE_VOICE_DIALOG(state) {
      state.voiceDialogVisible = false
    }
  },
  actions: {
    // 警报提醒开关
    handleChangeNoticeSwitch(context, val) {
      context.commit('changeNoticeSwitch', val)
    },
    // 数量加1
    handleAddNotifyNum(context) {
      context.commit('addNotifyNum')
    },
    handleCutNotifyNum(context) {
      context.commit('cutNotifyNum')
    },
    // 改变数量
    handleChangeNotifyNum(context, num) {
      context.commit('changeNotifyNum', num)
    },
    handleOnlineStaffId(context, staffId) {
      context.commit('onlineStaffId', staffId)
    },
    handleTerminalOnline(context) {
      context.commit('terminalOnline')
    },
    handleTerminalOffline(context) {
      context.commit('terminalOffline')
    },
    handleStopOtherPlay(context) {
      context.commit('stopOtherPlay')
    },
    handleNotStopOtherPlay(context) {
      context.commit('notStopOtherPlay')
    },
    // 定位异常置为0
    handleSetPositionAbValueTo0(context) {
      context.commit('setPositionAbValueTo0')
    },
    // 改变定位异常数量
    handleSetPositionAbValue(context, num) {
      context.commit('setPositionAbValue', num)
    },
    // 紧急呼叫置为0
    handleSetEmCallValueTo0(context) {
      context.commit('setEmCallValueTo0')
    },
    // 改变紧急呼叫数量
    handleSetEmCallValue(context, num) {
      context.commit('setEmCallValue', num)
    },
    // 警告气体置为0
    handleSetWarnGasValueTo0(context) {
      context.commit('setWarnGasValueTo0')
    },
    // 改变警告气体数量
    handleSetWarnGasValue(context, num) {
      context.commit('setWarnGasValue', num)
    },
    // 显示语音对话框
    showVoiceDialog(context) {
      context.commit('SHOW_VOICE_DIALOG')
    },
    // 隐藏语音对话框
    hideVoiceDialog(context) {
      context.commit('HIDE_VOICE_DIALOG')
    },
    // 来电显示
    showIncomingCall(context) {
      context.commit('SHOW_INCOMING_CALL')
    },
    // 隐藏来电显示
    hideIncomingCall(context) {
      context.commit('HIDE_INCOMING_CALL')
    },
    // 紧急呼叫来电提醒显示
    showEmergencyCaller(context) {
      context.commit('SHOW_EMERGENCY_CALLer')
    },
    // 紧急呼叫来电提醒隐藏
    hideEmergencyCaller(context) {
      context.commit('HIDE_EMERGENCY_CALLer')
    },
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim() // 字符串两端的多余的空格
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          localStorage.setItem('token', data.data.token) // 保存token
          localStorage.setItem('account', data.data.account) // 保存用户名
          localStorage.setItem('userId', data.data.userId) // 保存userId
          location.reload() // 保存token之后刷新页面,确保再次请求之前带上token
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout(localStorage.getItem('token')).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 重新登录
    reLogin() {
      return new Promise(resolve => {
        localStorage.setItem('token', '')
        localStorage.setItem('account', '')
        localStorage.setItem('userId', '')
        resolve()
      })
    }
  }
}

export default user
