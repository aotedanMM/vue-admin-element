<template>
  <div>
    <!--单条语音组件-->
    <single-voice ref="singleVoiceRef" :single-voice-info="singleVoiceInfo"/>
    <!--气体警报组件-->
    <warning-gas ref="warningGasRef" :gas-warn-info="gasWarnInfo"/>
    <!--来电显示-->
    <incoming-call ref="IncomingCallRefs" :name-info="nameInfo" />
    <!--紧急呼叫-->
    <emergency-call-reminder ref="emCallReminderRefs" :emergency-info="emCallInfo"/>
    <!--工作异常-->
    <position-ab-reminder ref="positionAbReminderRefs" :position-ab-info="positionAbInfo"/>
    <!--特种作业人员异常-->
    <special-job-abnormal ref="specialJobAbRefs" :special-ab-info="specialJobAbInfo"/>
  </div>
</template>
<script>
import ReconnectingWebSocket from 'ReconnectingWebSocket'
import eventVue from '@/api/eventVue'
import WarningGas from '@/views/Reminder/WarningGas/index'
import SingleVoice from '@/views/Reminder/SingleVoice/index'
import IncomingCall from '@/views/VoiceChat/IncomingCall/index'
import EmergencyCallReminder from '@/views/Reminder/EmergencyCallReminder/index'
import PositionAbReminder from '@/views/Reminder/PositionAbReminder/index'
import SpecialJobAbnormal from '@/views/Reminder/SpecialJobAbnormal/index'
export default {
  name: 'GlobalWebSocket',
  components: { SpecialJobAbnormal, PositionAbReminder, EmergencyCallReminder, IncomingCall, SingleVoice, WarningGas },
  data() {
    return {
      nameInfo: {},
      globalWebSocket: null,
      positionAbInfo: {},
      specialJobAbInfo: {},
      emCallInfo: {},
      staffInfo: {},
      singleVoiceInfo: {},
      gasWarnInfo: {},
      voiceInfo: {
        postMsg: 'https://192.168.1.100/85523665165',
        staffId: 2,
        staffName: '房夫大',
        deptName: 'X煤集团/机电部门/机电三科',
        sequenceId: '9999',
        rangUrl: 'static/audio/phoneList/1.mp3',
        status: false
      }
    }
  },
  computed: {
    noticeSwitch() {
      return this.$store.state.user.noticeSwitch
    },
    globalCurrentUserId() {
      return this.$store.state.voice.globalCurrentUserId
    },
    voiceDialogVisible() {
      return this.$store.state.user.voiceDialogVisible
    },
    // 通知数量
    globalNotifyNum() {
      return this.$store.state.user.globalNotifyNum
    }
  },
  created() {
    this.webSocketInit()
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('closeGlobalWebSocket')
  },
  methods: {
    handleCommit() {
      eventVue.$on('closeGlobalWebSocket', () => {
        this.webSocketOnClose()
      })
    },
    handleCloseAll() {
      eventVue.$emit('closeWarningGasNotify')
      eventVue.$emit('closeSingleVoiceNotify')
      eventVue.$emit('closeEmergencyCallNotify')
      eventVue.$emit('closePositionAbNotify')
      eventVue.$emit('closeSpecialJobNotify')
      this.$store.dispatch('handleChangeNotifyNum', 0)
    },
    webSocketInit() {
      const wsServer = process.env.BASE_WS + 'webSocketServer'
      this.globalWebSocket = new ReconnectingWebSocket(wsServer)
      this.globalWebSocket.binaryType = 'blob'
      this.globalWebSocket.onopen = this.webSocketOnOpen // 连接建立
      this.globalWebSocket.onmessage = this.webSocketOnMessage // 数据接收
      this.globalWebSocket.onclose = this.webSocketOnClose // 连接关闭
      this.globalWebSocket.onerror = this.webSocketOnError // 连接错误
    },
    // 连接建立
    webSocketOnOpen() {
      console.log('开启globalWebSocket')
    },
    // 数据接收
    webSocketOnMessage(resp) {
      const result = JSON.parse(resp.data)
      const type = result.type
      const data = result.data
      // 推送警报气体
      if (type === 1) {
        console.log('推送警报气体')
        console.log(data)
        // 右侧消息提示警报气体
        if (this.globalNotifyNum === 8) {
          this.handleCloseAll()
        }
        this.$store.dispatch('handleAddNotifyNum') // 右侧提示信息数量+1
        this.gasWarnInfo = data
        this.gasData = Object.assign({}, this.gasWarnInfo) // 拷贝数据源,避免双向绑定数据源被改变
        this.$store.state.user.warnGasValue++ // 警报气体数量改变
        this.$store.dispatch('handleSetWarnGasValue', this.$store.state.user.warnGasValue++)
        // 如果警报提醒开关为开，则右侧弹窗提醒
        if (this.noticeSwitch) {
          this.$refs.warningGasRef.openWarnGasPoint(this.gasData)
        }
      }
      // 推送单条语音
      if (type === 2) {
        const code = data.code
        if (code === 1) {
          if (this.globalNotifyNum === 8) {
            this.handleCloseAll()
          }
          this.$store.dispatch('handleAddNotifyNum') // 右侧提示信息数量+1
          // 父组件调用子组件中的方法,收到单条语音，进行数据提示的推送
          console.log('接收到新的单条语音')
          console.log(data.voiceInfo) // 单条语音
          this.$refs.singleVoiceRef.openSingleVoice(data.voiceInfo)
          this.$store.dispatch('handleChangeCurrentUserId', data.voiceInfo.staffId)
          this.$store.dispatch('showVoiceDialog')
          eventVue.$emit('updateChatList', data.voiceInfo) // 更新到聊天列表
          // 接收到语音请求，若当前正在录音发送单条语音则发送语音再接电话
          // this.$nextTick(() => {
          //   eventVue.$emit('sendSingleVoiceBeforePhone')
          // })
        }
        if (code === 2) {
          console.log('code 2')
          // 更新语音的信息
          // 更新发送语音的已读状态
          this.$refs.voiceChatRef.handleUpdateReceiveVoiceStatus(data)
        }
      }
      // 实时语音状态交互
      if (type === 3) {
        // console.log(data)// 实时语音状态交互
      }
      // 终端故障
      if (type === 4) {
        console.log('终端故障')
        console.log(data)
        if (data.malfunctionValue === 0) {
          this.$store.state.malfunctionValue = null
        } else {
          this.$store.state.malfunctionValue = data.malfunctionValue
        }
      }
      // 基站自检异常
      if (type === 5) {
        console.log('基站自检异常')
        console.log(data)
      }
      // 电量警报
      if (type === 6) {
        console.log('电量警报')
        console.log(data)
        if (data.batteryAlarmValue === 0) {
          this.$store.state.batteryAlarmValue = null
        } else {
          this.$store.state.batteryAlarmValue = data.batteryAlarmValue
        }
      }
      // 基站欠电报警
      if (type === 7) {
        // console.log(data)
      }
      // 基站掉线数量
      if (type === 8) {
        console.log('基站掉线数量')
        console.log(data)
        if (data.offlineNum === 0) {
          this.$store.state.offLineStationValue = null
        } else {
          this.$store.state.offLineStationValue = data.offlineNum
        }
      }
      // 紧急呼叫
      if (type === 9) {
        if (this.globalNotifyNum === 8) {
          this.handleCloseAll()
        }
        this.$store.dispatch('handleAddNotifyNum') // 右侧提示信息数量+1
        console.log('紧急呼叫')
        console.log(data)
        this.emCallInfo.staffId = data.staffId
        this.emCallInfo.staffName = data.staffName
        this.emCallInfo.deptName = data.deptName
        this.emCallInfo.rangeUrl = data.rangeUrl
        // 右侧消息提示紧急呼叫(数量增加,提示,响铃)
        this.emCallData = Object.assign({}, this.emCallInfo)
        this.$store.state.user.emCallValue++
        this.$store.dispatch('handleSetEmCallValue', this.$store.state.user.emCallValue++)
        // 如果警报提醒开关为开，则右侧弹窗提醒
        if (this.noticeSwitch) {
          this.$refs.emCallReminderRefs.openEmCallPoint(this.emCallData)
        }
      }
      // 工作异常提醒
      if (type === 10) {
        if (this.globalNotifyNum === 8) {
          this.handleCloseAll()
        }
        this.$store.dispatch('handleAddNotifyNum') // 右侧提示信息数量+1
        console.log('工作异常')
        console.log(data)
        this.positionAbInfo.staffId = data.staffId
        this.positionAbInfo.staffName = data.staffName
        this.positionAbInfo.deptName = data.deptName
        this.positionAbInfo.rangeUrl = data.rangeUrl
        // 右侧消息提示工作异常(数量增加,提示,响铃)
        this.positionAbData = Object.assign({}, this.positionAbInfo)
        this.$store.state.user.positionAbValue++
        this.$store.dispatch('handleSetPositionAbValue', this.$store.state.user.positionAbValue++)
        // 如果警报提醒开关为开，则右侧弹窗提醒
        if (this.noticeSwitch) {
          this.$refs.positionAbReminderRefs.openPositionAbPoint(this.positionAbData) // 右侧消息提示
        }
      }
      // 特种作业人员工作异常
      if (type === 11) {
        if (this.globalNotifyNum === 8) {
          this.handleCloseAll()
        }
        this.$store.dispatch('handleAddNotifyNum') // 右侧提示信息数量+1
        console.log('特种作业人员工作异常')
        console.log(data)
        this.specialJobAbInfo.staffId = data.staffId
        this.specialJobAbInfo.staffName = data.staffName
        this.specialJobAbInfo.deptName = data.deptName
        this.specialJobAbInfo.rangeUrl = data.rangeUrl
        // 右侧消息提示特种作业人员工作异常(数量增加,提示,响铃)
        this.specialJobAbData = Object.assign({}, this.specialJobAbInfo)
        this.$store.state.user.positionAbValue++
        this.$store.dispatch('handleSetPositionAbValue', this.$store.state.user.positionAbValue++)
        // 如果警报提醒开关为开，则右侧弹窗提醒
        if (this.noticeSwitch) {
          this.$refs.specialJobAbRefs.openSpecialJobAbPoint(this.specialJobAbData) // 右侧消息提示
        }
      }
      // 终端上线
      if (type === 12) {
        if (!this.$store.state.voice.globalVoiceStatus) {
          this.$store.dispatch('handleOnlineStaffId', data.staffId)
          console.log('终端上下线')
          console.log(data)
          // 在线
          if (data.code === 1) {
            console.log('在线')
            this.$store.dispatch('handleTerminalOnline')
          } else {
            console.log('不在线')
            this.$store.dispatch('handleTerminalOffline')
          }
        }
      }
    },
    // 连接关闭
    webSocketOnClose() {
      this.globalWebSocket.close()
      console.log('GlobalWebSocket关闭')
    },
    // 连接错误
    webSocketOnError() {
      console.log('GlobalWebSocket异常')
    }
  }
}
</script>
