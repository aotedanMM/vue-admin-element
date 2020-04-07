<template>
  <!--警报气体-->
  <div v-show="warningGasVisible" class="m_warningGas">
    <vue-audio-player ref="vueAudioPlayerRefs" :voice-url="warnListSrc"/>
  </div>
</template>
<script>
import VueAudioPlayer from '@/components/VueAudioPlayer/index'
import eventVue from '@/api/eventVue'
export default {
  name: 'WarningGas',
  components: { VueAudioPlayer },
  props: {
    gasWarnInfo: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      warningGasVisible: false,
      warningGasInfo: [],
      warnListSrc: 'static/audio/warnList/1.wav'
    }
  },
  created() {
    this.handleCommit()
  },
  methods: {
    handleCommit() {
      eventVue.$on('closeWarningGasNotify', () => {
        this.$notify.closeAll() // 关闭所有提示窗口
      })
    },
    routerToWarningGas() {
      this.$router.push({
        path: 'warn/gas',
        name: 'Gas'
      })
      this.$nextTick(() => {
        this.$refs.vueAudioPlayerRefs.pausePlayerVoice()
      })
    },
    // 气体警报提示
    openWarnGasPoint(gasData) {
      this.warningGasInfo = gasData
      this.playerData = Object.assign({}, this.warningGasInfo) // 拷贝数据源,避免双向绑定数据源被改变
      this.warnListSrc = this.playerData.rangUrl
      const that = this
      this.getGasType()
      this.$nextTick(() => {
        this.$refs.vueAudioPlayerRefs.startPlayPlayerVoice()
      })
      const h = this.$createElement
      const instance = this.$notify({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        title: this.warningGasInfo.gasTypeName,
        message: h('a', '甲烷: ' + this.warningGasInfo.ch4 + '% 一氧化碳:' + this.warningGasInfo.co + 'ppm 氧气：' +
            this.warningGasInfo.o2 + '%' + '\n' + '温度：' + this.warningGasInfo.temperature + '℃ 湿度：' + this.warningGasInfo.humidity + '%'),
        duration: 0,
        onClick: function() {
          // 暂停语音
          that.routerToWarningGas()
          instance.close()
        },
        onClose: function() {
          that.$store.dispatch('handleCutNotifyNum')
          // 暂停语音
          that.$nextTick(() => {
            that.$refs.vueAudioPlayerRefs.pausePlayerVoice()
          })
        }
      })
    },
    // 解析警报气体等级信息
    getGasType() {
      switch (this.warningGasInfo.gasLevel) {
        case 1 :
          this.warningGasInfo.gasTypeName = '一级警报'
          break
        case 2:
          this.warningGasInfo.gasTypeName = '二级警报'
          break
        case 3 :
          this.warningGasInfo.gasTypeName = '三级警报'
          break
        case 4:
          this.warningGasInfo.gasTypeName = '四级警报'
          break
        case 5:
          this.warningGasInfo.gasTypeName = '五级警报'
          break
        case 6:
          this.warningGasInfo.gasTypeName = '六级警报'
          break
        default:
          this.warningGasInfo.gasTypeName = '一级警报'
          this.warnListSrc = 'static/audio/warnList/4.wav'
          break
      }
    }
  }
}
</script>
