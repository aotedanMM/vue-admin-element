<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <!--<div class="m_logo"><img src="static/img/zkxh-logo2.png"></div>-->
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar class="m_navBar"/>
      <app-main class="m_appMain"/>
    </div>
    <!--聊天组件-->
    <keep-alive><voice-chat ref="voiceChatRef" @closeVoiceChat="handleCloseVoiceChat"/></keep-alive>
    <!--地图页面webSocket-->
    <position-web-socket/>
    <!--全局webSocket-->
    <global-web-socket/>
    <!--语音通话webSocket-->
    <voice-web-socket/>
    <!--语音流传输webSocket-->
    <stream-web-socket/>
  </div>
</template>
<script>
import PositionWebSocket from '@/commonWebSocket/PositionWebSocket'
import GlobalWebSocket from '@/commonWebSocket/GlobalWebSocket'
import VoiceWebSocket from '@/commonWebSocket/VoiceWebSocket'
import StreamWebSocket from '@/commonWebSocket/StreamWebSocket'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import VoiceChat from '@/views/VoiceChat/index'
import { getLackElectricCount } from '@/api/lackElectricInfo'
import { getMalfunctionCount } from '@/api/malfunction'
import { getOfflineStationCount } from '@/api/station'
export default {
  name: 'Layout',
  components: { StreamWebSocket, VoiceWebSocket, GlobalWebSocket, PositionWebSocket, VoiceChat, Navbar, Sidebar, AppMain },
  mixins: [ResizeMixin],
  inject: ['reload'],
  data: function() {
    return {
      phoneVoiceSrc: 'static/audio/warnList/4.wav'
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    globalNotifyNum() {
      return this.$store.state.user.globalNotifyNum
    }
  },
  // watch: {
  //   globalNotifyNum() {
  //     // 当前窗口最多显示8条提示信息,超过8条关闭各种提示信息窗口
  //     if (this.globalNotifyNum === 8) {
  //       setTimeout(() => {
  //         eventVue.$emit('closeWarningGasNotify')
  //         eventVue.$emit('closeSingleVoiceNotify')
  //         eventVue.$emit('closeEmergencyCallNotify')
  //         eventVue.$emit('closePositionAbNotify')
  //         eventVue.$emit('closeSpecialJobNotify')
  //         this.$store.dispatch('handleChangeNotifyNum', 0)
  //       }, 10 * 1000)
  //     }
  //   }
  // },
  created() {
    this.handleJudgeValue()
    this.addVal()
    this.getOfflineCount()
    this.handleFetchNotifyNum()
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        // 刷新页面
        // this.reload()
      }, 2000)
    }
  },
  destroyed() {
    clearInterval(this.timer)
    window.onbeforeunload = null
  },
  methods: {
    // 获取提示信息数量
    handleFetchNotifyNum() {
      this.$store.dispatch('handleChangeNotifyNum', document.getElementsByClassName('el-notification').length)
    },
    // 考虑到第一次加载项目时localStorage里没有positionAbValue，所以要先做判断
    handleJudgeValue() {
      const localStorage1 = localStorage.getItem('positionAbValue')
      if (localStorage1 !== null) {
        this.$store.dispatch('handleSetPositionAbValue', JSON.parse(localStorage1))
      }
      const localStorage2 = localStorage.getItem('emCallValue')
      if (localStorage2 !== null) {
        this.$store.dispatch('handleSetEmCallValue', JSON.parse(localStorage2))
      }
      const localStorage3 = localStorage.getItem('warnGasValue')
      if (localStorage3 !== null) {
        this.$store.dispatch('handleSetWarnGasValue', JSON.parse(localStorage3))
      }
      const localStorage4 = localStorage.getItem('noticeSwitch')
      if (localStorage4) {
        this.$store.dispatch('handleChangeNoticeSwitch', JSON.parse(localStorage4))
      } else {
        this.$store.dispatch('handleChangeNoticeSwitch', 'true')
      }
    },
    // 关闭语音聊天对话窗
    handleCloseVoiceChat() {
      this.$store.dispatch('hideVoiceDialog')
    },
    getOfflineCount() {
      getOfflineStationCount().then(resp => {
        const result = resp.data
        if (result.code === 200) {
          if (result.data === 0) {
            this.$store.state.offLineStationValue = null
          } else {
            this.$store.state.offLineStationValue = result.data
          }
        } else if (resp.data.code !== 111) {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    // 电量警报数量
    addVal() {
      getLackElectricCount().then(resp => {
        const result = resp.data
        const code = result.code
        if (code === 200) {
          if (result.data === 0) { this.$store.state.batteryAlarmValue = null } else this.$store.state.batteryAlarmValue = result.data
        } else if (resp.data.code !== 111) {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
      // 自检异常数量
      getMalfunctionCount().then(resp => {
        const result = resp.data
        const code = result.code
        if (code === 200) {
          if (result.data === 0) { this.$store.state.malfunctionValue = null } else this.$store.state.malfunctionValue = result.data
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .el-submenu__icon-arrow{right: 40px !important;}
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
