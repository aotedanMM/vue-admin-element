<template>
  <div v-show="positionAbVisible" class="m_warningGas">
    <vue-audio-player ref="positionAbAudioRefs" :voice-url="positionAbSrc"/>
  </div>
</template>
<script>
import VueAudioPlayer from '@/components/VueAudioPlayer/index'
import eventVue from '@/api/eventVue'
export default {
  name: 'PositionAbReminder',
  components: { VueAudioPlayer },
  props: {
    positionAbInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      positionAbData: [],
      positionAbSrc: 'static/audio/warnList/4.wav',
      positionAbVisible: false
    }
  },
  created() {
    this.handleCommit()
  },
  methods: {
    handleCommit() {
      eventVue.$on('closePositionAbNotify', () => {
        this.$notify.closeAll() // 关闭所有提示窗口
      })
    },
    // 点击语音 显示语音对话框
    routerToVoiceChatWindow() {
      this.$router.push({
        path: 'warn/workAbnormal',
        name: 'WorkAbnormal'
      })
      // 暂停语音
      this.$nextTick(() => {
        this.$refs.positionAbAudioRefs.pausePlayerVoice()
      })
    },
    // 单条语音提示
    openPositionAbPoint(positionAbData) {
      this.positionAbData = Object.assign({}, positionAbData)
      const that = this
      // 播放语音
      this.$nextTick(() => {
        this.$refs.positionAbAudioRefs.startPlayPlayerVoice()
      })
      const h = this.$createElement
      const instance = this.$notify({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        title: '工作异常',
        message: h('a', this.positionAbData.staffName + '-' + this.positionAbData.deptName),
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
            that.$refs.positionAbAudioRefs.pausePlayerVoice()
          })
        }
      })
    }
  }
}
</script>
