<template>
  <div/>
</template>
<script>
/* eslint-disable */
  const dataOfJson = {}
  function createJsonData(key, val) {
    // 如果 val 被忽略
    if (typeof val === 'undefined') {
      // 删除属性
      delete dataOfJson[key]
    } else {
      // 添加 或 修改
      dataOfJson[key] = val
    }
  }
  import ReconnectingWebSocket from 'ReconnectingWebSocket'
  import eventVue from '@/api/eventVue'
  export default {
    name: 'VoiceWebSocket',
    data() {
      return {
        voiceWebSocket: null,
        staffInfo: {},
        ipPort: null,
        hangUpTimeout: null
      }
    },
    computed: {
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
      // 挂断状态
      voiceDialogVisible() {
        return this.$store.state.user.voiceDialogVisible
      }
    },
    created() {
      this.openChannel() // 开启语音相关webSocket
      this.handleCommit() // 兄弟组件通信
    },
    beforeDestroy() {
      eventVue.$off('clearHungUpTimeout')
      eventVue.$off('answerVoiceWebSocket')
      eventVue.$off('hangUpVoiceWebSocket')
      eventVue.$off('hangUnAnswerVoiceWebSocket')
      eventVue.$off('rejectVoiceWebSocket')
      eventVue.$off('callVoiceWebSocket')
      eventVue.$off('closeVoiceWebSocket')
    },
    methods: {
      handleCommit() {
        // 自动挂断电话
        eventVue.$on('clearHungUpTimeout',()=>{
          clearTimeout(this.hangUpTimeout)
        })
        // 接听电话
        eventVue.$on('answerVoiceWebSocket', (staffInfo) => {
          if(this.voiceWebSocket.readyState === 1) {
            createJsonData('cmd', '2008')
            createJsonData('result', '55')
            createJsonData('ipPort', staffInfo.ipPort)
            createJsonData('staffId', staffInfo.staffId)
            this.voiceWebSocket.send(JSON.stringify(dataOfJson))
          }
        })
        // 挂断电话
        eventVue.$on('hangUpVoiceWebSocket', (ipPort) => {
          if(this.voiceWebSocket.readyState === 1) {
            createJsonData('cmd', '2008')
            createJsonData('result', '99')
            createJsonData('ipPort', ipPort)
            console.log('挂断电话')
            console.log(JSON.stringify(dataOfJson))
            this.voiceWebSocket.send(JSON.stringify(dataOfJson))
          }
        })
        // 未接听的挂断电话
        eventVue.$on('hangUnAnswerVoiceWebSocket', (ipPort) => {
          if(this.voiceWebSocket.readyState === 1) {
          createJsonData('cmd', '2008')
          createJsonData('result', '77')
          createJsonData('ipPort', ipPort)
          console.log('未接听的挂断电话')
          console.log(JSON.stringify(dataOfJson))
          this.voiceWebSocket.send(JSON.stringify(dataOfJson))
          }
        })
        // 拒绝接听电话
        eventVue.$on('rejectVoiceWebSocket', (staffInfo) => {
          if(this.voiceWebSocket.readyState === 1) {
            createJsonData('cmd', '2008')
            createJsonData('result', '88')
            createJsonData('ipPort', staffInfo.ipPort)
            createJsonData('staffId', staffInfo.staffId)
            this.voiceWebSocket.send(JSON.stringify(dataOfJson))
          }
        })
        // 呼叫终端
        eventVue.$on('callVoiceWebSocket', (currentUserId) => {
          if(this.voiceWebSocket.readyState === 1) {
          createJsonData('cmd', '2008')
          createJsonData('result', '33')
          createJsonData('staffId', currentUserId)
          console.log('呼叫终端')
          console.log(JSON.stringify(dataOfJson))
          this.voiceWebSocket.send(JSON.stringify(dataOfJson))
          }
        })
        // 关闭连接
        eventVue.$on('closeVoiceWebSocket', () => {
          this.onChannelClosed()
        })
      },
      // 语音相关
      openChannel() {
        const voiceStatusWs = process.env.VOICE_WS + 'voiceStatusWebSocket'
        this.voiceWebSocket = new ReconnectingWebSocket(voiceStatusWs)
        this.voiceWebSocket.binaryType = 'blob'
        this.voiceWebSocket.onopen = this.onChannelOpened // 开启触发函数
        this.voiceWebSocket.onmessage = this.onChannelMessage // 接收数据触发函数
        this.voiceWebSocket.onclose = this.onChannelClosed // 关闭socket触发的函数
        this.voiceWebSocket.onerror = this.onChannelError // 产生错误触发的函数
      },
      onChannelOpened() {
        console.log('开启voiceWebSocket')
      },
      onChannelMessage(e) {
        const data = JSON.parse(e.data)
        const voiceMsg = data.data
        // const cmd = voiceMsg.cmd // 获取到的 2008 状态码   ???  获取还是写死2008
        const result = voiceMsg.result
        this.ipPort = voiceMsg.ipPort // 获取到的ipPort
        console.log('接收到webSocket消息')
        console.log(data)
        this.staffInfo = voiceMsg.nameInfo // 员工姓名 部门 分组
        this.gasInfo = voiceMsg.gasInfo // 气体信息
        this.phoneVoiceSrc = voiceMsg.rangUrl // 来电语音src路径
        // 终端已经连接到9999端口
        if (result == 11) {
          console.log('result 11')
          // TODO 发送状态的Key 以实现多点
          this.$store.dispatch('handleAnswerStatus') // 接听状态
          eventVue.$emit('voiceConnected') // 开始计时,改变当前状态
          eventVue.$emit('openStreamWebSocket') // 开启webSocket流传输
          eventVue.$emit('pausePhoneVoice') // 停止响铃
        }
        // 呼叫终端被响应 等待终端连接9999端口
        if (result == 22) {
          console.log('result 22')
          this.$message('语音连接中')
          clearTimeout(this.hangUpTimeout)  // 清除自动挂断定时器
        }
        // 接收到语音呼叫请求
        if (result == 44) {
          console.log('result 44')
          console.log('接收到语音呼叫请求')
          this.$store.dispatch('handleStopOtherPlay') // 停止其他响铃
          this.staffInfo.staffId = voiceMsg.staffInfo.staff_id
          this.staffInfo.ipPort = voiceMsg.ipPort
          console.log('staffInfo')
          console.log(this.staffInfo)
          this.$store.dispatch('showIncomingCall') // 来电显示
          this.$store.dispatch('handleChangeCurrentUserId',this.staffInfo.staffId)
          this.$store.dispatch('handleChangeGlobalStartUserId',this.staffInfo.staffId)
          eventVue.$emit('openIncomingCall', this.staffInfo) // 右下角来电显示
          eventVue.$emit('playPhoneVoice', this.phoneVoiceSrc) // 来电响铃
          // 接收到语音请求，若当前正在录音发送单条语音则发送语音再接电话
          this.$nextTick(()=>{
            eventVue.$emit('sendSingleVoiceBeforePhone')
          })
        }
        // 查询条件全部符合,可以呼叫
        if (result == 55) {
          console.log('result 55')
          createJsonData('cmd', '2008')
          createJsonData('result', '44')
          createJsonData('ipPort', this.ipPort)
          this.voiceWebSocket.send(JSON.stringify(dataOfJson))
          // 可以呼叫的情况下 60秒未接听 主动挂断
          this.hangUpTimeout = setTimeout(()=>{
            // 未接听 且 语音通话状态 非挂断状态
            if(!this.globalAnswerStatus && this.globalVoiceStatus) {
              this.$message('暂时无人接听，请稍后再试')
              eventVue.$emit('endCall')
            }
          },60*1000)
        }
        // 呼叫后获得返回的占线结果
        if (result == 66) {
          console.log('result 66')
          this.$message('终端繁忙，请稍后再试')
          eventVue.$emit('TerminalEndCall') // 执行挂断函数
        }
        // 呼叫后,获得终端不在线的状态
        if (result == 77) {
          console.log('result 77')
          this.$message('终端不在线')
          eventVue.$emit('TerminalEndCall') // 执行挂断函数
          // eventVue.$emit('AddVoiceCallRecordSend','呼叫已取消')
        }
        // 呼叫后获得拒绝接听状态
        if (result == 88) {
          console.log('result 88')
          console.log('拒绝')
          this.$message('拒绝接听')
          eventVue.$emit('TerminalEndCall')
          clearTimeout(this.hangUpTimeout) // 清除自动挂断定时器
          eventVue.$emit('AddVoiceCallRecordSend','对方已拒绝')
          eventVue.$emit('addVoiceCallRecordData',2)
        }
        // 挂断状态
        if (result == 99) {
          this.$store.dispatch('handleNotVoiceCallStatus')
          console.log('result 99')
          this.$message('终端挂断')
          // eventVue.$emit('closeStreamWebSocket') // 关闭语音流webSocket
          eventVue.$emit('TerminalEndCall') // 执行挂断函数
          clearTimeout(this.hangUpTimeout)  // 清除自动挂断定时器
        }
        // 下呼上 上未处理 下挂断
        if(result == 10) {
          console.log('result 10')
          console.log(data.data)
          const staffInfo = data.data.staffInfo
          let updateInfo = {}
          this.$store.dispatch('showVoiceDialog')  // 打开语音聊天窗口
          this.$store.dispatch('hideIncomingCall') // 来电显示窗口关闭
          updateInfo.staffId = staffInfo.staff_id
          updateInfo.staffName = staffInfo.staff_name
          updateInfo.deptName = staffInfo.dept_name
          console.log('updateInfo')
          console.log(updateInfo)
          this.$nextTick(()=>{
            eventVue.$emit('updateChatList', updateInfo) // 更新到聊天列表
            this.$store.dispatch('handleChangeCurrentUserId',updateInfo.staffId)
            eventVue.$emit('TerminalEndCall') // 执行挂断函数
            // eventVue.$emit('addVoiceCallRecordData', 3) // 往数据库中新增一条接收语音记录
            // eventVue.$emit('AddVoiceCallRecordReceive', '对方已取消') // 聊天窗口新增一条接收语音记录
          })
        }
      },
      onChannelClosed() {
        this.voiceWebSocket.close()
        console.log('VoiceWebSocket关闭')
      },
      onChannelError() {
        // console.log(e)
        console.log('语音webSocket异常')
      }
    }
  }
</script>
