<template>
  <div v-show="emCallReminderVisible" class="m_warningGas">
    <vue-audio-player ref="emCallAudioRefs" :voice-url="emCallSrc"/>
  </div>
</template>
<script>
import VueAudioPlayer from '@/components/VueAudioPlayer/index'
import eventVue from '@/api/eventVue'
export default {
  name: 'EmergencyCallReminder',
  components: { VueAudioPlayer },
  props: {
    emergencyInfo: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      emCallData: [],
      emCallSrc: 'static/audio/warnList/1.wav',
      emCallReminderVisible: false
    }
  },
  created() {
    this.handleCommit()
  },
  methods: {
    handleCommit() {
      eventVue.$on('closeEmergencyCallNotify', () => {
        this.$notify.closeAll() // 关闭所有提示窗口
      })
    },
    // 点击语音 显示语音对话框
    routerToVoiceChatWindow() {
      this.$router.push({
        path: 'warn/emergencyCall',
        name: 'EmergencyCall'
      })
      // 暂停语音
      this.$nextTick(() => {
        this.$refs.emCallAudioRefs.pausePlayerVoice()
      })
    },
    // 单条语音提示
    openEmCallPoint(emCallData) {
      this.emCallData = Object.assign({}, emCallData)
      this.emCallSrc = this.emCallData.rangeUrl
      const that = this
      // 播放语音
      this.$nextTick(() => {
        this.$refs.emCallAudioRefs.startPlayPlayerVoice()
      })
      const h = this.$createElement
      const instance = this.$notify({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        title: '紧急呼叫',
        message: h('a', this.emCallData.staffName + '-' + this.emCallData.deptName),
        duration: 0,
        onClick: function() {
          that.routerToVoiceChatWindow()
          // 点击提示信息,onClose,关闭提示窗口,停止响铃
          instance.close()
        },
        onClose: function() {
          that.$store.dispatch('handleCutNotifyNum')
          // 暂停语音
          that.$nextTick(() => {
            that.$refs.emCallAudioRefs.pausePlayerVoice()
          })
        }
      })
    }
  }
}
</script>
