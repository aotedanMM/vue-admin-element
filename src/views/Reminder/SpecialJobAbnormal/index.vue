<template>
  <div v-show="specialAbVisible" class="m_warningGas">
    <vue-audio-player ref="positionAbAudioRefs" :voice-url="positionAbSrc"/>
  </div>
</template>
<script>
import VueAudioPlayer from '@/components/VueAudioPlayer/index'
import eventVue from '@/api/eventVue'
export default {
  name: 'SpecialJobAbnormal',
  components: { VueAudioPlayer },
  props: {
    specialAbInfo: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      positionAbData: [],
      positionAbSrc: 'static/audio/warnList/1.wav',
      specialAbVisible: false
    }
  },
  created() {
    this.handleCommit()
  },
  methods: {
    handleCommit() {
      eventVue.$on('closeSpecialJobNotify', () => {
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
    openSpecialJobAbPoint(specialJobAbData) {
      this.specialJobAbData = Object.assign({}, specialJobAbData)
      this.positionAbSrc = this.specialJobAbData.rangeUrl
      const that = this
      // 播放语音
      this.$nextTick(() => {
        this.$refs.positionAbAudioRefs.startPlayPlayerVoice()
      })
      const h = this.$createElement
      const instance = this.$notify({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        title: '特种作业人员工作异常',
        message: h('a', this.specialJobAbData.staffName + '-' + this.specialJobAbData.deptName),
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
