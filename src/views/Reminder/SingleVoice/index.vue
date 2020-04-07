<template>
  <div v-show="singeVoiceVisible" class="m_warningGas">
    <vue-audio-player ref="singeAudioRefs" :voice-url="voiceListSrc"/>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import VueAudioPlayer from '@/components/VueAudioPlayer/index'
export default {
  name: 'SingleVoice',
  components: { VueAudioPlayer },
  props: {
    singleVoiceInfo: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      singleVoiceData: [],
      voiceListSrc: 'static/audio/voiceList/1.wav',
      singeVoiceVisible: false
    }
  },
  created() {
    this.handleCommit()
  },
  methods: {
    handleCommit() {
      eventVue.$on('closeSingleVoiceNotify', () => {
        this.$notify.closeAll() // 关闭所有提示窗口
      })
    },
    // 点击语音 显示语音对话框
    routerToVoiceChatWindow() {
      // 暂停语音
      this.$nextTick(() => {
        this.$refs.singeAudioRefs.pausePlayerVoice()
      })
      this.$store.dispatch('showVoiceDialog')
    },
    // 单条语音提示
    openSingleVoice(singleData) {
      this.singleVoiceData = singleData
      this.singleplayerData = Object.assign({}, this.singleVoiceData)
      this.voiceListSrc = this.singleplayerData.rangUrl
      const that = this
      // 播放语音
      this.$nextTick(() => {
        this.$refs.singeAudioRefs.startPlayPlayerVoice()
      })
      const h = this.$createElement
      const instance = this.$notify({
        dangerouslyUseHTMLString: true,
        title: this.singleVoiceData.staffName + ' ' + '新语音消息',
        message: h('a', this.singleVoiceData.deptName),
        duration: 0,
        onClick: function() {
          that.routerToVoiceChatWindow()
          // 点击提示信息,onClose,关闭提示窗口,停止响铃
          instance.close()
          // eventVue.$emit('handleCallStaff', that.singleVoiceData) // $emit这个方法会触发一个事件
        },
        onClose: function() {
          that.$store.dispatch('handleCutNotifyNum')
          // 暂停语音
          that.$nextTick(() => {
            that.$refs.singeAudioRefs.pausePlayerVoice()
          })
        }
      })
    }
  }
}
</script>
