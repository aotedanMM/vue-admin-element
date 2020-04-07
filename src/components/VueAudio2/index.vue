<template>
  <!--发送语音-->
  <div style="width: 100%;height: 50px;margin:20PX 0;position: relative;display: flex;flex-direction: row-reverse; ">
    <div class="m_triangle"/>
    <div class="m_triangle2"/>
    <div v-loading="audio.waiting" :style="{width: widthPercent + '%'}" class="di main-wrap" @click="startPlayOrPause()">
      <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
      <audio
        ref="audio"
        :seqId="sequenceId"
        :codecType="1"
        :src="voiceUrl"
        :preload="audio.preload"
        class="dn"
        @play="onPlay"
        @error="onError"
        @waiting="onWaiting"
        @pause="onPause"
        @timeupdate="onTimeupdate"
        @loadedmetadata="onLoadedmetadata"
      >audio</audio>
      <!--播放按钮-->
      <p :class="objectClass2"/>
    </div>
    <div style="width: 5%">
      <p v-if="audio.maxTime===0" class="voiceTime">1</p>
      <p v-else class="voiceTime">{{ audio.maxTime | formatSecond }}"</p>
    </div>
    <!--发送语音消息未读状态 暂时隐藏-->
    <!--<el-badge :hidden="badgeStatus" is-dot class="item badge2"/>-->
  </div>
</template>
<script>
/* eslint-disable */
import eventVue from '@/api/eventVue'
function realFormatSecond(second) {
  var secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    return second
  } else {
    return '0'
  }
}
export default {
  name: 'VueAudio2',
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
    sequenceId: {
      type: String,
      required: true
    },
    voiceUrl: {
      type: String,
      required: true
    },
    badgeStatus: {
      type: Boolean,
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
      playStatusError: false,
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,
        muted: false,
        speed: 1,
        waiting: false,
        preload: 'auto'
      },
      objectClass2: {
        m_voicePlay12: true,
        m_voicePlay22: false
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
        onlyOnePlaying: true,
        // 不要快进按钮
        noSpeed: false
      }
    }
  },
  computed: {
    widthPercent() {
      if (this.audio.maxTime < 2) {
        return 3
      }
      if (this.audio.maxTime > 30) {
        return 45
      }
      return this.audio.maxTime / 60 * 100
    }
  },
  created() {
    this.handleCommit()
    this.setControlList()
    this.$nextTick(() => {
      Speex.checkAudioElements(this.$refs.audio)
    })
  },
  methods: {
    handleCommit() {
      eventVue.$on('stopVueAudio2', () => {
        if (this.audio.playing) {
          this.pausePlay()
        }
      })
    },
    // 播放或暂停
    startPlayOrPause() {
      // 更新发送语音已读状态，通过webSocket触发
      this.$emit('updateSendVoiceStatus', this.sequenceId)
      return this.audio.playing ? this.pausePlay() : this.startPlay()
    },
    // 开始播放
    startPlay() {
      const codecType = this.$refs.audio.getAttribute('codecType')
      if (codecType === '2') {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.setAttribute('codecType', '2')
        this.$refs.audio.play()
      }
      if (!this.playStatusError && this.audio.maxTime) {
        this.objectClass2.m_voicePlay22 = true
      }
    },
    // 暂停
    pausePlay() {
      this.$refs.audio.pause()
      this.objectClass2.m_voicePlay22 = false
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
      this.objectClass2.m_voicePlay22 = false
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

    // 当发生错误, 就出现loading状态
    onError() {
      this.audio.waiting = false
      // this.objectClass.m_voicePlay2 = true
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
  .voiceTime{
    margin-right: 15px !important;
    color: #777 !important;
    position: absolute;
    bottom: 5px;
  }
  .main-wrap{
    margin-right: 12px !important;
    color:#fff;height:50PX;
    background-color:#4ba4ff;
    border:1px solid #409eff;
    border-radius: 6px;
    padding: 0 0 0 10%;
    /*max-width: 75%;*/
    /*min-width:25%;*/
    position: relative;
    float:right;}
  .m_triangle{
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: #409eff;
    position: absolute;
    top: 19px;
    right: 0;
  }
  .m_triangle2{
    z-index: 9;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-left-color: #4ba4ff;
    position: absolute;
    top: 20px;
    right: 3px;
  }
  .el-tag{
    border: none !important;background: transparent !important;font-size: 15px;line-height: 50px;color:#fff;float: right;
  }
  .slider {
    display: inline-block;
    width: 100px;
    position: relative;
    top: 14px;
    margin-left: 15px;
  }

  .di {
    display: inline-block;
  }
  .download {
    color: #409EFF;
    margin-left: 15px;
  }

  .dn{
    display: none;
  }

</style>
