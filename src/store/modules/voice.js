const voice = {
  state: {
    globalVoiceStatus: false, // 语音通话状态
    globalRecordStatus: false, // 录音状态
    globalAnswerStatus: false, // 接听状态
    globalCurrentUserId: null, // 当前正在语音窗口的员工ID
    globalStartUserId: null, // 开始录音或通话时的员工ID, 判断结束时，是否为当前员工ID,考虑添加组件问题
    globalCallDuration: null, // 通话时长
    globalVoiceWindowNull: false, // 当前语音列表是否为空
    globalLoadDataFlag: true // 加载数据标记
  },
  mutations: {
    // 更改加载数据标记
    changeGlobalLoadDataFlag(state, globalLoadDataFlag) {
      state.globalLoadDataFlag = globalLoadDataFlag
    },
    // 当前语音列表是否为空
    changeGlobalVoiceWindowNull(state, globalVoiceWindowNull) {
      state.globalVoiceWindowNull = globalVoiceWindowNull
    },
    // 更改当前语音通话时长
    changeCallDuration(state, callDuration) {
      state.globalCallDuration = callDuration
    },
    // 改变当前语音窗口的员工ID
    changeCurrentUserId(state, staffId) {
      state.globalCurrentUserId = staffId
    },
    // 改变开始录音或通话时的员工ID
    changeGlobalStartUserId(state, staffId) {
      state.globalStartUserId = staffId
    },
    // 接听状态
    answerStatus(state) {
      state.globalAnswerStatus = true
    },
    // 非接听状态
    notAnswerStatus(state) {
      state.globalAnswerStatus = false
    },
    // 语音通话状态
    voiceStatus(state) {
      state.globalVoiceStatus = true
    },
    // 非语音通话状态
    notVoiceStatus(state) {
      state.globalVoiceStatus = false
    },
    // 录音状态
    recordStatus(state) {
      state.globalRecordStatus = true
    },
    // 非录音状态
    notRecordStatus(state) {
      state.globalRecordStatus = false
    }
  },
  actions: {
    // 更改加载数据标记
    handleChangeGlobalLoadDataFlag(context, globalLoadDataFlag) {
      context.commit('changeGlobalLoadDataFlag', globalLoadDataFlag)
    },
    // 更改当前语音列表是否为空
    handleChangeGlobalVoiceWindowNull(context, globalVoiceWindowNull) {
      context.commit('changeGlobalVoiceWindowNull', globalVoiceWindowNull)
    },
    // 更改当前语音通话时长
    handleChangeCallDuration(context, callDuration) {
      context.commit('changeCallDuration', callDuration)
    },
    // 更改当前正在语音窗口的员工ID
    handleChangeCurrentUserId(context, staffId) {
      context.commit('changeCurrentUserId', staffId)
    },
    // 改变开始录音或通话时的员工ID
    handleChangeGlobalStartUserId(context, staffId) {
      context.commit('changeGlobalStartUserId', staffId)
    },
    // 接听状态
    handleAnswerStatus(context) {
      context.commit('answerStatus')
    },
    // 非接听状态
    handleNotAnswerStatus(context) {
      context.commit('notAnswerStatus')
    },
    // 语音通话状态
    handleVoiceCallStatus(context) {
      context.commit('voiceStatus')
    },
    // 非语音通话状态
    handleNotVoiceCallStatus(context) {
      context.commit('notVoiceStatus')
    },
    // 录音状态
    handleRecordStatus(context) {
      context.commit('recordStatus')
    },
    // 非录音状态
    handleNotRecordStatus(context) {
      context.commit('notRecordStatus')
    }
  }
}

export default voice
