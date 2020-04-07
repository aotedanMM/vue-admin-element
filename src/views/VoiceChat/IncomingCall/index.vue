<template>
  <!--来电显示-->
  <div v-show="this.$store.state.user.incomingCall" class="voiceCall">
    <div class="voiceCallT">
      <span class="m_voiceCallStaff">{{ staffInfo.staffName }}</span>
      <span class="m_voiceCallDept"> - {{ staffInfo.deptName }}</span>
    </div>
    <div class="voiceCallM">
      <img src="static/img/voiceCall.png">
    </div>
    <div class="voiceCallB">
      <el-button type="success" @click="answer">接听</el-button>
      <el-button type="danger" @click="hangUp">拒绝</el-button>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'IncomingCall',
  data() {
    return {
      staffInfo: {}
    }
  },
  created() {
    this.handleOpenIncomingCall()
  },
  beforeDestroy() {
    eventVue.$off('openIncomingCall')
  },
  methods: {
    // 来电显示
    handleOpenIncomingCall() {
      eventVue.$on('openIncomingCall', (staffInfo) => {
        this.staffInfo.staffId = staffInfo.staffId
        this.staffInfo.staffName = staffInfo.staffName
        this.staffInfo.deptName = staffInfo.deptName
        this.staffInfo.ipPort = staffInfo.ipPort
      })
    },
    // 接听来电
    answer() {
      // console.log('接听')
      // console.log(this.staffInfo)
      this.$store.dispatch('showVoiceDialog')
      this.$store.dispatch('handleVoiceCallStatus') // 语音状态
      this.$store.dispatch('handleAnswerStatus') // 接听状态
      this.$nextTick(() => {
        eventVue.$emit('answerPhone', this.staffInfo)
        eventVue.$emit('answerVoiceWebSocket', this.staffInfo)
        eventVue.$emit('updateChatList', this.staffInfo) // 更新到聊天列表
      })
      this.$store.dispatch('handleChangeCurrentUserId', this.staffInfo.staffId) // 更改当前正在语音窗口的员工ID全局变量
    },
    // 拒接来电
    hangUp() {
      // console.log('拒绝')
      // console.log(this.staffInfo)
      this.$store.dispatch('showVoiceDialog')
      this.$store.dispatch('handleNotVoiceCallStatus')// 非语音状态
      this.$store.dispatch('handleNotAnswerStatus') // 非接听状态
      this.$nextTick(() => {
        eventVue.$emit('rejectPhone', this.staffInfo)
        eventVue.$emit('rejectVoiceWebSocket', this.staffInfo)
        eventVue.$emit('updateChatList', this.staffInfo) // 更新到聊天列表
        eventVue.$emit('AddVoiceCallRecordReceive', '已拒绝')
        eventVue.$emit('addVoiceCallRecordData', 4)
      })
    }
  }
}
</script>
