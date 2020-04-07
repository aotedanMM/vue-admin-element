<template>
  <div class="window_input">
    <div class="window_button">
      <!--呼叫-->
      <img :src="phoneBgUrl" class="m_window_button1" @click="handleCallStaff">
      <!--录音-->
      <img :src="voiceBgUrl" class="m_window_button1" @click="handleStartRecord">
      <!--聊天记录-->
      <img :src="recordBgUrl" class="m_window_button2" @click="openHistoryRecord" >
    </div>
    <!--录音提示-->
    <p v-show="globalRecordStatus" class="window_Point" >正在录音...</p>
    <!--呼叫提示-->
    <p v-show="voiceCallWait" class="m_callingTip">呼叫中，等待接听</p>
    <!--接听提示-->
    <p v-show="globalAnswerStatus" class="m_callingTip"><call-duration ref="CallTimes"/></p>
    <el-button class="m_hangUpBtn" @click="handleStopAndSend">发送</el-button>
    <!--通话中-->
    <div v-show="globalVoiceStatus" class="m_calling">
      <img :src="hangupUrl" class="callingImg" @click="handleHangUpPhone">
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import CallDuration from '@/components/CallDuration'
import { addVoiceCallRecord } from '@/api/chat'
export default {
  name: 'WindowFooter',
  components: {
    CallDuration
  },
  data() {
    return {
      sendFilledTips: null,
      sendVoiceTime: null,
      timer: null,
      recordQuery: {}, // 实时语音通话新增记录
      voiceSendStatus: false, // 单条语音发送成功状态
      sendRecordStatus: false, // 单条语音是否可以发送
      ipPort: null,
      voiceBgUrl: 'static/img/icon15.png', // 录音
      recordBgUrl: 'static/img/icon16.png', // 聊天记录
      phoneBgUrl: 'static/img/icon17.png', // 呼叫
      hangupUrl: 'static/img/hangUp.png', // 挂断
      staffInfo: {}
    }
  },
  computed: {
    // 当前语音聊天员工ID
    globalCurrentUserId() {
      return this.$store.state.voice.globalCurrentUserId
    },
    // 开始录音或通话的员工ID
    globalStartUserId() {
      return this.$store.state.voice.globalStartUserId
    },
    // 显示呼叫等待
    voiceCallWait() {
      return !!(this.globalVoiceStatus && !this.globalAnswerStatus)
    },
    // 语音通话状态
    globalVoiceStatus() {
      return this.$store.state.voice.globalVoiceStatus
    },
    // 录音状态
    globalRecordStatus() {
      return this.$store.state.voice.globalRecordStatus
    },
    // 接听状态
    globalAnswerStatus() {
      return this.$store.state.voice.globalAnswerStatus
    },
    // 通话时长
    globalCallDuration() {
      return this.$store.state.voice.globalCallDuration
    }
  },
  created() {
    this.handleCommit() // 兄弟组件通信
    this.handleCommitVoice() // 语音通话webSocket部分的通信
  },
  beforeDestroy() {
    eventVue.$off('sendSingleVoiceBeforePhone')
    eventVue.$off('clearAllInterval')
    eventVue.$off('addVoiceCallRecordData')
    eventVue.$off('transferSendStatus')
    eventVue.$off('chatListToWindowFooter')
    eventVue.$off('answerPhone')
    eventVue.$off('rejectPhone')
    eventVue.$off('endCall')
    eventVue.$off('TerminalEndCall')
    eventVue.$off('voiceConnected')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('sendSingleVoiceBeforePhone', () => {
        if (this.globalRecordStatus) {
          this.handleStopAndSend()
        }
      })
      // 关闭页面清除所有定时器
      eventVue.$on('clearAllInterval', () => {
        if (this.sendFilledTips) {
          clearTimeout(this.sendFilledTips)
          this.sendFilledTips = null
        }
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        if (this.sendVoiceTime) {
          clearTimeout(this.sendVoiceTime)
          this.sendVoiceTime = null
        }
      })
      eventVue.$on('addVoiceCallRecordData', (type) => {
        this.handleAddVoiceCallRecord(type)
      })
      // 传递发送语音成功与否状态
      eventVue.$on('transferSendStatus', (voiceSendStatus) => {
        this.voiceSendStatus = voiceSendStatus
      })
      // 点击聊天列表数据传送到footer
      eventVue.$on('chatListToWindowFooter', (staffInfo) => {
        this.staffInfo = staffInfo
        this.staffId = this.staffInfo.staffId
      })
      // 接听电话
      eventVue.$on('answerPhone', (staffInfo) => {
        this.staffInfo = staffInfo
        this.ipPort = staffInfo.ipPort
        this.staffId = staffInfo.staffId
        this.handleAnswerPhone()
      })
      // 拒绝电话
      eventVue.$on('rejectPhone', (staffInfo) => {
        this.staffId = staffInfo.staffId
        this.handleRejectPhone()
      })
      // 调度中心挂断函数
      eventVue.$on('endCall', () => {
        this.handleHangUpPhone()
      })
      // 终端挂断
      eventVue.$on('TerminalEndCall', () => {
        this.handleTerminalHangUpPhone()
      })
    },
    // 语音通话webSocket部分的通信
    handleCommitVoice() {
      // 语音连接到9999端口 code=11
      eventVue.$on('voiceConnected', () => {
        this.$refs.CallTimes.start()// 调用子组件中的开始计时方法
      })
    },
    // 接听电话
    handleAnswerPhone() {
      // console.log('接听电话')
      this.$store.dispatch('hideIncomingCall') // 关闭来电显示窗口
      this.$store.dispatch('showVoiceDialog') // 打开聊天窗口
      eventVue.$emit('pausePhoneVoice') // 停止响铃
    },
    // 终端挂断电话
    handleTerminalHangUpPhone() {
      if (this.globalAnswerStatus) {
        this.$refs.CallTimes.stop()// 停止计时
        eventVue.$emit('AddVoiceCallRecordReceive', '通话时长' + this.globalCallDuration)
        eventVue.$emit('addVoiceCallRecordData', 6)
        eventVue.$emit('closeStreamWebSocket') // 关闭语音流webSocket
        eventVue.$emit('closeContext') // 关闭用户录音的语音流
        eventVue.$emit('closePlayer') // 关闭播放来自硬件的语音流
      }
      eventVue.$emit('pausePhoneVoice') // 停止响铃
      this.$store.dispatch('handleNotVoiceCallStatus') // 非语音状态
      this.$store.dispatch('handleNotAnswerStatus') // 非接听状态
    },
    // 调度中心挂断电话
    handleHangUpPhone() {
      // 接听状态挂断
      if (this.globalAnswerStatus) {
        eventVue.$emit('hangUpVoiceWebSocket', this.ipPort)
        eventVue.$emit('closeContext') // 关闭用户录音的语音流
        eventVue.$emit('closePlayer') // 关闭播放来自硬件的语音流
        this.$refs.CallTimes.stop()// 停止计时
        eventVue.$emit('AddVoiceCallRecordSend', '通话时长' + this.globalCallDuration)
        eventVue.$emit('addVoiceCallRecordData', 5)
        eventVue.$emit('closeStreamWebSocket') // 关闭语音流webSocket
      } else {
        // 未接听挂断
        this.$refs.CallTimes.stop()// 停止计时
        eventVue.$emit('hangUnAnswerVoiceWebSocket', this.ipPort)
        eventVue.$emit('clearHungUpTimeout')
        // 聊天窗口新增一条取消呼叫
        eventVue.$emit('AddVoiceCallRecordSend', '已取消')
        this.handleAddVoiceCallRecord(1)
      }
      eventVue.$emit('pausePhoneVoice') // 停止响铃
      this.$store.dispatch('handleNotVoiceCallStatus') // 非语音状态
      this.$store.dispatch('handleNotAnswerStatus') // 非接听状态
    },
    // 新增通话记录到当前聊天窗口
    handleAddVoiceCallRecord(type) {
      // console.log('新增通话记录到当前聊天窗口')
      // 发送实时通话
      if (type === 1 || type === 2 || type === 5) {
        this.recordQuery.postUserId = localStorage.getItem('userId')
        this.recordQuery.receiceUserId = this.globalStartUserId
      } else {
        // 接收实时通话
        this.recordQuery.postUserId = this.globalStartUserId
        this.recordQuery.receiceUserId = localStorage.getItem('userId')
      }
      this.recordQuery.timeLong = this.globalCallDuration
      this.recordQuery.type = type
      // console.log('新增一条通话记录')
      // console.log(this.recordQuery)
      addVoiceCallRecord(this.recordQuery).then(resp => {
        // console.log(resp.data)
        if (resp.data.code !== 200) {
          this.$message(resp.data.msg)
        }
      })
    },
    // 拒接电话
    handleRejectPhone() {
      this.$store.dispatch('hideIncomingCall') // 来电显示窗口关闭
      eventVue.$emit('pausePhoneVoice') // 停止响铃
    },
    // 呼叫员工
    handleCallStaff() {
      // 判断当前语音通话状态
      if (!this.globalRecordStatus) {
        if (!this.globalVoiceStatus) {
          this.$store.dispatch('handleVoiceCallStatus') // 语音通话状态
          // console.log('呼叫')
          this.$message('正在呼叫' + this.staffInfo.staffName)
          eventVue.$emit('playPhoneVoice', '') // 播放铃声
          eventVue.$emit('updateChatListNotFetchMoreData', this.staffInfo) // 更新到聊天列表
          eventVue.$emit('callVoiceWebSocket', this.globalCurrentUserId)
          this.$store.dispatch('handleChangeCurrentUserId', this.globalCurrentUserId) // 更改当前正在语音窗口的员工ID全局变量
          this.$store.dispatch('handleChangeGlobalStartUserId', this.globalCurrentUserId) //  更改开始呼叫的员工ID全局变量
        }
      }
    },
    // 开始录音
    handleStartRecord() {
      // 呼叫和录音不能 同时进行
      if (!this.globalVoiceStatus) {
        if (!this.globalRecordStatus) {
          eventVue.$emit('updateChatListNotFetchMoreData', this.staffInfo) // 更新到聊天列表
          this.$store.dispatch('handleChangeCurrentUserId', this.globalCurrentUserId) // 更改当前正在语音窗口的员工ID全局变量
          this.$store.dispatch('handleChangeGlobalStartUserId', this.globalCurrentUserId) // 更改开始录音的员工ID全局变量
          this.$store.dispatch('handleRecordStatus') // 录音状态
          eventVue.$emit('startRecord')
          clearTimeout(this.sendFilledTips)
          this.sendFilledTips = null
          this.sendRecordStatus = false
          // 这里是限制录音时间不能太短，小于1秒会解析不出来语音时长，故定时器的执行速速要大于1秒，避免bug
          this.timer = setTimeout(() => {
            this.sendRecordStatus = true
          }, 1300)
          // 限制录音最多一分钟,超过一分钟自动发送
          this.sendVoiceTime = setTimeout(() => {
            this.handleStopAndSend()
            this.$message('单条语音最多发送时长为1分钟')
          }, 60.5 * 1000)
        }
      }
    },
    // 录音完成,点击发送按钮
    handleStopAndSend() {
      if (!this.globalVoiceStatus) {
        if (this.globalRecordStatus) {
          // console.log('发送录音')
          if (this.sendRecordStatus) {
            eventVue.$emit('pauseRecord')
            this.sendFilledTips = setTimeout(() => {
              if (!this.voiceSendStatus) {
                this.$message('语音发送失败,请稍后再试')
              }
            }, 5 * 1000)
          } else {
            eventVue.$emit('stopRecord')
            this.$message({ message: '说话时间太短' })
          }
          this.sendRecordStatus = false // 发送录音之后，发送状态置为false
          this.$store.dispatch('handleNotRecordStatus') // 非录音状态
          clearTimeout(this.sendVoiceTime) // 清除一分钟发送的定时器
          clearTimeout(this.timer) // 清除设置发送状态的定时器
          this.sendVoiceTime = null
          this.timer = null
        } else {
          this.$message({
            message: '请先录音再发送'
          })
        }
      }
    },
    // 查看历史记录
    openHistoryRecord() {
      if (this.globalCurrentUserId) {
        eventVue.$emit('fetchHistoryRecord', this.globalCurrentUserId)
      }
    }
  }
}
</script>
