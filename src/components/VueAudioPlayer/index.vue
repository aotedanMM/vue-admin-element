<template>
  <div v-loading="audio.waiting" class="di">
    <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
    <audio
      id="vueAudioPlayerId"
      ref="audio"
      :src="voiceUrl"
      :preload="audio.preload"
      class="dn"
      @play="onPlay"
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    >播放语音</audio>
    <!--播放按钮-->
  </div>
</template>
<script>
function realFormatSecond(second) {
  var secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)
    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60
    return second
  } else {
    return '0'
  }
}
export default {
  name: 'VueAudioPlayer',
  filters: {
    formatSecond(second = 0) {
      return realFormatSecond(second)
    },
    transPlayPause(value) {
      return value ? '暂停' : '播放'
    },
    transMutedOrNot(value) {
      return value ? '放音' : '静音'
    },
    transSpeed(value) {
      return '快进: x' + value
    }
  },
  props: {
    voiceUrl: {
      type: String,
      required: true
    },
    theSpeeds: {
      type: Array,
      default() {
        return [1, 1.5, 2]
      }
    },
    theControlList: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      firstPlayFlag: true, // 第一次播放标记
      pauseAudioFlg: false, // 暂停标记
      playPromise: null,
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,
        muted: false,
        speed: 1,
        waiting: false,
        preload: 'auto'
      },
      sliderTime: 0,
      volume: 100,
      speeds: this.theSpeeds,
      controlList: {
        // 不显示下载
        noDownload: false,
        // 不显示静音
        noMuted: false,
        // 不显示音量条
        noVolume: false,
        // 不显示进度条
        noProcess: false,
        // 只能播放一个
        onlyOnePlaying: false,
        // 不要快进按钮
        noSpeed: false
      }
    }
  },
  created() {
    this.setControlList()
  },
  methods: {
    // 开始播放警告气体提示音
    startPlayPlayerVoice() {
      this.audioPlayer = document.getElementById('vueAudioPlayerId')
      // 判断是否为第一次播放,如果为第一次播放则不设置延时
      if (this.firstPlayFlag) {
        this.playPlayerVoice()
        this.firstPlayFlag = false
      } else {
        if (this.$store.state.user.stopOtherPlayStatus) {
          this.playPromise = this.audioPlayer.play()
          if (this.playPromise) {
            this.playPromise.then(() => {
            // 音频加载成功
            // 音频的播放需要耗时
              setTimeout(() => {
                if (!this.pauseAudioFlg) {
                  // 判断是否被暂停,如果被暂停则不播放
                  this.audioPlayer.load() // (播放之前重新加载,确保是从第一秒开始播放)
                  this.playPlayerVoice()
                }
              }, this.audioPlayer.duration * 1000) // audio.duration 为音频的时长单位为秒
            }).catch((e) => {
            })
          }
        }
      }
    },
    // 播放
    playPlayerVoice() {
      if (this.$store.state.user.stopOtherPlayStatus) {
        if (this.audioPlayer.paused) {
          this.audioPlayer.play()
        } else {
          this.audioPlayer.play()
        }
      }
    },
    // 暂停
    pausePlayerVoice() {
      if (this.$store.state.user.stopOtherPlayStatus) {
        this.pauseAudioFlg = true
        if (this.audioPlayer.played) {
          this.audioPlayer.pause()
        // this.audioPlayer.load()
        } else {
          this.audioPlayer.pause()
        // this.audioPlayer.load()
        }
      }
    },
    // 播放或暂停
    startPlayOrPause() {
      return this.audio.playing ? this.pausePlay() : this.startPlay()
    },
    setControlList() {
      const controlList = this.theControlList.split(' ')
      controlList.forEach((item) => {
        if (this.controlList[item] !== undefined) {
          this.controlList[item] = true
        }
      })
    },
    changeSpeed() {
      const index = this.speeds.indexOf(this.audio.speed) + 1
      this.audio.speed = this.speeds[index % this.speeds.length]
      this.$refs.audio.playbackRate = this.audio.speed
    },
    startMutedOrNot() {
      this.$refs.audio.muted = !this.$refs.audio.muted
      this.audio.muted = this.$refs.audio.muted
    },
    // 音量条toolTip
    formatVolumeToolTip(index) {
      return '音量条: ' + index
    },
    // 进度条toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt(this.audio.maxTime / 100 * index)
      return '进度条: ' + realFormatSecond(index)
    },
    // 音量改变
    changeVolume(index = 0) {
      this.$refs.audio.volume = index / 100
      this.volume = index
    },
    // 播放跳转
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
    },
    // 当发生错误, 就出现loading状态
    onError() {
      this.audio.waiting = false
    },
    // 当音频开始等待
    onWaiting(res) {
    },
    // 当音频开始播放
    onPlay(res) {
      this.audio.playing = true
      this.audio.loading = false

      if (!this.controlList.onlyOnePlaying) {
        return
      }

      const target = res.target

      const audios = document.getElementsByTagName('audio');

      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause()
        }
      })
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.waiting = false
      this.audio.maxTime = parseInt(res.target.duration)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .di {
    display: inline-block;
  }
.dn{
  display: inline-block !important;
}
</style>
