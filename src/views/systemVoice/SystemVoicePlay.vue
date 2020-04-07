<template>
  <div>
    <audio id="systemAudio" :src="systemVoiceSrc" :autoplay="systemVoiceAutoPlay" loop/>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'SystemVoicePlay',
  data() {
    return {
      systemAudio: '',
      systemVoiceSrc: '',
      systemVoiceAutoPlay: false
    }
  },
  created() {
    this.playSystemVoice() // 兄弟组件通信 播放铃声
  },
  beforeDestroy() {
    eventVue.$off('playSystemVoice')
  },
  methods: {
    // 兄弟组件通信 播放铃声
    playSystemVoice() {
      eventVue.$on('playSystemVoice', (src) => {
        this.systemVoiceAutoPlay = true
        this.systemVoiceSrc = src
        this.handlePlaySystemVoice()
      })
    },
    // 播放铃声
    handlePlaySystemVoice() {
      this.systemAudio = document.getElementById('systemAudio')
      // 判断当前audio状态 若为播放状态则先暂停解决play方法被打断问题
      if (this.systemAudio.played) {
        this.systemAudio.pause()
      } else {
        this.systemAudio.play()
      }
    }
  }
}
</script>
