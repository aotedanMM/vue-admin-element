<template>
  <!--来电显示-->
  <div v-show="this.$store.state.user.emergencyCaller" class="voiceCall">
    <p class="m_emergencyCall">紧急呼叫</p>
    <div class="voiceCallT">
      <span class="m_voiceCallStaff">{{ staffInfo.staffName }}</span>
      <span class="m_voiceCallDept"> - {{ staffInfo.deptName }}</span>
    </div>
    <div class="voiceCallM2">
      <img src="static/img/emergencyCall.png">
    </div>
    <div class="voiceCallB2">
      <el-button class="answerBtn" type="success" @click="answer">接听</el-button>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'EmergencyCaller',
  data() {
    return {
      staffInfo: {}
    }
  },
  created() {
    this.handleOpenIncomingCall()
  },
  beforeDestroy() {
    eventVue.$off('openEmergencyCall')
  },
  methods: {
    // 来电显示
    handleOpenIncomingCall() {
      eventVue.$on('openEmergencyCall', (staffInfo) => {
        this.staffInfo.staffId = staffInfo.staffId
        this.staffInfo.staffName = staffInfo.staffName
        this.staffInfo.deptName = staffInfo.deptName
      })
    },
    // 接听来电
    answer() {
      eventVue.$emit('answerPhone', this.staffInfo)
      this.$store.dispatch('hideEmergencyCaller') // 关闭来电显示窗口
    }
  }
}
</script>
