<template>
  <div>
    <audio id="audio2" :autoplay="autoPlay2" :src="phoneVoiceSrc" loop >语音提醒</audio>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'VoiceRemind',
  data() {
    return {
      autoPlay2: false,
      phoneVoiceSrc: 'static/audio/phoneList/1.mp3'
    }
  },
  created() {
    this.handlePlayPhoneVoice()
  },
  beforeDestroy() {
    eventVue.$off('playPhoneVoice')
    eventVue.$off('pausePhoneVoice')
  },
  methods: {
    // 语音播放
    handlePlayPhoneVoice() {
      // 语音播放
      eventVue.$on('playPhoneVoice', (message) => {
        if (message !== '') {
          this.phoneVoiceSrc = message
        }
        this.autoPlay2 = false
        this.playVoice2()
      })
      // 语音暂停
      eventVue.$on('pausePhoneVoice', () => {
        this.pauseVoice2()
      })
    },
    // 暂停提示音 -- 语音来电
    pauseVoice2() {
      this.autoPlay2 = true
      this.playOnlyOne()
      this.audio2 = document.getElementById('audio2')
      // 播放语音,状态设置为pause,调用play3方法时才能确保播放语音
      if (this.audio2.paused) {
        this.audio2.pause()
      } else {
        this.audio2.pause()
      }
    },
    // 播放提示音 -- 语音来电
    playVoice2() {
      this.autoPlay2 = true
      this.playOnlyOne()
      this.audio2 = document.getElementById('audio2')
      // 判断当前audio状态 若为播放状态则先暂停解决play方法被打断问题
      if (this.audio2.paused) {
        // 每次都重新加载确保语音为从头播放
        this.audio2.load()
        this.audio2.play()
      } else {
        this.audio2.play()
      }
    },
    // 每次仅播放一条
    playOnlyOne() {
      // 获取所有audios
      const audios = document.getElementsByTagName('audio')
      // 暂停函数
      function pauseAll() {
        const self = this;
        [].forEach.call(audios, function(i) {
          // 将audios中其他的audio全部暂停
          i !== self && i.pause()
        })
      }
      // 给play事件绑定暂停函数
      [].forEach.call(audios, function(i) {
        i.addEventListener('play', pauseAll.bind(i))
      })
    }

  }
}
</script>
