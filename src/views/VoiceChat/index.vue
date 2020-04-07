<template>
  <div class="m_dialogContent">
    <el-dialog
      :before-close="closeVoiceChat"
      :modal-append-to-body="appendToBody"
      :visible.sync="this.$store.state.user.voiceDialogVisible"
      @open="common.toggleBody(1)"
      @close="common.toggleBody(0)">
      <el-container>
        <!--侧边栏-->
        <el-aside>
          <!--左侧菜单-->
          <chat-menu
            @openPhoneList="handleOpenPhoneList"
            @openChatList="handleOpenChatList"
          />
          <!--聊天列表-->
          <keep-alive><chat-list v-show="chatListVisible" ref="chatListRefs"/></keep-alive>
          <!--通讯录-->
          <keep-alive><phone-list v-show="phoneListVisible" ref="phoneListRefs"/></keep-alive>
        </el-aside>
        <!--聊天窗口-->
        <el-container>
          <!--header-->
          <el-header v-show="globalVoiceWindowNull"> <window-header ref="WindowHeaderRefs"/> </el-header>
          <!--main-->
          <el-main v-show="globalVoiceWindowNull"> <window-main ref="WindowMainRefs"/> </el-main>
          <!--footer-->
          <keep-alive>
            <el-footer v-show="globalVoiceWindowNull"><window-footer v-show="footerVisible" ref="WindowFooterRefs"/></el-footer>
          </keep-alive>
        </el-container>
      </el-container>
    </el-dialog>
    <!--聊天记录-->
    <chat-history ref="ChatHistoryRefs"/>
    <!--语音提醒-->
    <voice-remind ref="voiceRemindRefs"/>
    <!--实时语音通话-->
    <real-time-voice-call/>
    <!--单条语言-->
    <single-voice/>
  </div>
</template>
<script>
import ChatHistory from './ChatHistory'
import IncomingCall from './IncomingCall'
import WindowHeader from './VoiceChatWindow/WindowHeader'
import WindowMain from './VoiceChatWindow/WindowMain'
import WindowFooter from './VoiceChatWindow/WindowFooter'
import ChatList from './VoiceChatSidebar/ChatList'
import PhoneList from './VoiceChatSidebar/PhoneList'
import ChatMenu from './VoiceChatSidebar/ChatMenu'
import VoiceRemind from './VoiceRemind/index'
import RealTimeVoiceCall from './realTimeVoiceCall'
import SingleVoice from './singleVoice'
import eventVue from '../../api/eventVue'
export default {
  name: 'VoiceChat',
  components: { SingleVoice, RealTimeVoiceCall, VoiceRemind, ChatMenu, PhoneList, ChatList, WindowFooter, WindowMain, WindowHeader, ChatHistory, IncomingCall },
  data() {
    return {
      appendToBody: false,
      voiceChatVisible: false,
      footerVisible: true,
      chatListVisible: true,
      phoneListVisible: false
    }
  },
  computed: {
    globalVoiceWindowNull() {
      return this.$store.state.voice.globalVoiceWindowNull
    },
    voiceDialogVisible() {
      return this.$store.state.user.voiceDialogVisible
    },
    globalVoiceCallStatus() {
      return this.$store.state.voice.globalVoiceStatus
    }
  },
  watch: {
    // 监听全局变量,当语音聊天窗口显示时,body不滚动
    voiceDialogVisible: function() {
      this.common.toggleBody(1)
      if (this.voiceDialogVisible) {
        // 聊天窗口打开,获取聊天列表
        this.$nextTick(() => {
          eventVue.$emit('fetchChatList') // 获取聊天列表
        })
      } else {
        eventVue.$emit('clearAllInterval') // 清除定时器
        eventVue.$emit('clearGasInfoInterval') // 清除定时器
        eventVue.$emit('stopVueAudio') // 关闭当前播放的单条语音
        eventVue.$emit('stopVueAudio2') // 关闭当前播放的单条语音
      }
    },
    // 通话状态(通话中添加监听事件,结束通话移除监听事件)
    globalVoiceCallStatus: function() {
      if (this.globalVoiceCallStatus) {
        // 当前为正在通话中，则添加按键和刷新事件的监听事件
        window.addEventListener('keydown', this.listenerHandle, false)// 按键
        window.addEventListener('beforeunload', this.listenerHandle2, false) // 浏览器刷新
        window.addEventListener('oncontextmenu', this.listenerHandle3, false) // 右键刷新
      } else {
        // 关闭聊天窗口时，清除 按键和刷新事件的监听事件
        //* **通过addEventListener添加的监听器，只能通过removeEventListener清除** *//
        window.removeEventListener('keydown', this.listenerHandle, false) // 按键
        window.removeEventListener('beforeunload', this.listenerHandle2, false) // 浏览器刷新
        window.removeEventListener('oncontextmenu', this.listenerHandle3, false) // 右键刷新
      }
    }
  },
  mounted() {
    // this.contextMenuTarget = this.$refs.contextRefs // 聊天列表右键删除提示初始化
    const _this = this
    // // 当聊天窗口可见时,禁止刷新
    window.onbeforeunload = function(e) {
      if (_this.globalVoiceCallStatus) {
        e = e || window.event
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          event.cancelBubble = true
          return false
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        event.cancelBubble = true
        return false
      }
    }
    // 禁止右键弹出菜单
    // document.oncontextmenu = function() {
    //   return false
    // }
  },
  methods: {
    // ------------------- 刷新事件 -------------------//
    // 按键&刷新事件的监听事件
    listenerHandle(e) {
      if (e.keyCode === 116) {
        // console.log(e.keyCode)
        this.$message({
          type: 'info',
          message: '当前正在通话中，请勿刷新页面'
        })
        if (window.event) {
          // console.log(window.event)
          try {
            e.keyCode = 0
          } catch (e) {
            console.log(e)
          }
          e.returnValue = false
        } else {
          e.preventDefault()
        }
      }
    },
    listenerHandle2(e) {
      e = e || window.event
      if (window.event) {
        e.cancelBubble = true
        e.returnValue = false
        return false
      } else {
        e.cancelBubble = true
        e.preventDefault()
        return false
      }
    },
    listenerHandle3(e) {
      if (window.event) {
        e.returnValue = false
      } else {
        e.cancelBubble = true
        e.preventDefault()
      }
    },
    // ------------------- 侧边栏 -------------------//
    // 显示聊天列表
    handleOpenChatList() {
      this.chatListVisible = true
      this.phoneListVisible = false
    },
    // 显示通讯录
    handleOpenPhoneList() {
      this.chatListVisible = false
      this.phoneListVisible = true
    },
    // ------------------- 聊天窗口 -------------------//
    // 关闭语音聊天对话窗
    closeVoiceChat() {
      this.$confirm('确认关闭当前语音对话窗口？')
        .then(() => {
          if (this.$store.state.voice.globalVoiceStatus) {
            this.$refs.WindowFooterRefs.handleHangUpPhone() // 挂断电话
          }
          if (this.$store.state.voice.globalRecordStatus) {
            this.$refs.WindowFooterRefs.handleStopAndSend() // 结束录音
          }
          this.$store.dispatch('handleNotStopOtherPlay')
          this.$emit('closeVoiceChat') // 关闭语音聊天窗口
        })
        .catch(() => {

        })
    }
  }
}
</script>
<style scoped>
  .el-container{background: #f0f0f0 !important;}
  .el-main{background: #fff;}
  .el-footer{background: #fff;}
</style>
